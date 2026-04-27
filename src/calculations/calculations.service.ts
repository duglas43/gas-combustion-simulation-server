import { Injectable } from '@nestjs/common';
import { HeatBalanceSolverService } from 'src/heat-balance-solver/heat-balance-solver.service';
import { ObservationDto } from 'src/observations/dtos';
import { Observation } from 'src/observations/entities';
import { CreateStateDto } from 'src/state/dtos';
import { StateService } from 'src/state/state.service';

@Injectable()
export class CalculationsService {
  constructor(
    private readonly heatBalanceSolverService: HeatBalanceSolverService,
    private readonly stateService: StateService,
  ) {}

  getCalculations(createStateDto: CreateStateDto): ObservationDto {
    const mockObservation = new Observation();
    mockObservation.time = new Date();
    mockObservation.timestamp = 0;
    mockObservation.efficiency = 0;
    mockObservation.adiabaticCombustionTemperature = 1850;
    mockObservation.furnaceExitTemperature = 840;
    mockObservation.firstConvectivePackageExitTemperature = 290;
    mockObservation.secondConvectivePackageExitTemperature = 215;
    mockObservation.economizerExitTemperature = 150;
    mockObservation.flueGasTemperature = 0;
    mockObservation.fuelConsumption = 0;
    mockObservation.lossesWithFlueGasPercentage = 0;
    mockObservation.lossesThroughWallsPercentage = 0;
    mockObservation.totalLosses = 0;
    mockObservation.furnaceImbalance = 0;
    mockObservation.firstConvectivePackageImbalance = 0;
    mockObservation.secondConvectivePackageImbalance = 0;
    mockObservation.economizerImbalance = 150;
    const calculatedState = this.stateService.calculate(createStateDto);
    const observation = this.heatBalanceSolverService.solveStep(
      mockObservation,
      calculatedState,
      {
        maxInternalIterations: 100000,
        threshold: 0.001,
      },
    );
    return new ObservationDto(observation);
  }
}
