import { Observation } from 'src/observations/entities';
import { SolverResult } from '../interfaces';
import { ObservationRepository } from 'src/observations/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SolverResultToObservationMapper {
  constructor(private readonly observationRepository: ObservationRepository) {}

  map(result: SolverResult): Observation {
    return this.observationRepository.create({
      efficiency: result.heatBalance.boilerEfficiencyGross,
      adiabaticCombustionTemperature:
        result.furnaceHeatBalance.acceptedAdiabaticCombustionTemperature,
      furnaceExitTemperature:
        result.furnaceHeatBalance.calculatedFurnaceExitTemperature,
      firstConvectivePackageExitTemperature:
        result.firstConvectivePackageHeatBalance
          .calculatedPackageExitTemperature,
      secondConvectivePackageExitTemperature:
        result.secondConvectivePackageHeatBalance
          .calculatedPackageExitTemperature,
      economizerExitTemperature:
        result.economizerHeatBalance.calculatedEconomizerExitTemperature,
      flueGasTemperature: result.heatBalance.flueGasTemperatureSet,

      fuelConsumption: result.heatBalance.calculatedHourlyFuelConsumption,

      lossesWithFlueGasPercentage:
        result.heatBalance.heatLossWithFlueGasesPercentage,

      lossesThroughWallsPercentage:
        result.heatBalance.heatLossThroughOuterWallsPercentage,

      totalLosses: result.heatBalance.totalHeatLoss,

      furnaceImbalance: result.furnaceHeatBalance.calculatedImbalance,
      firstConvectivePackageImbalance:
        result.firstConvectivePackageHeatBalance.heatBalanceImbalance,
      secondConvectivePackageImbalance:
        result.secondConvectivePackageHeatBalance.heatBalanceImbalance,
      economizerImbalance: result.economizerHeatBalance.heatBalanceImbalance,
    });
  }
}
