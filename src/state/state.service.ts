import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStateDto, UpdateStateDto } from './dtos';
import { State } from './entities';
import { EconomizerCharacteristicsService } from 'src/phisics/economizer-characteristics/economizer-characteristics.service';
import { BoilerCharacteristicsService } from 'src/phisics/boiler-characteristics/boiler-characteristics.service';
import { FuelCompositionsService } from 'src/phisics/fuel-compositions/fuel-compositions.service';
import { FurnaceCharacteristicsService } from 'src/phisics/furnace-characteristics/furnace-characteristics.service';
import { ConvectivePackagesService } from 'src/phisics/convective-packages/convective-packages.service';
import { BoilerCharacteristic } from 'src/phisics/boiler-characteristics/entities';
import { FuelComposition } from 'src/phisics/fuel-compositions/entities';
import { FurnaceCharacteristic } from 'src/phisics/furnace-characteristics/entities';
import { ConvectivePackage } from 'src/phisics/convective-packages/entities';
import { StateRepository } from './repositories';

@Injectable()
export class StateService {
  public constructor(
    private readonly economizerCharacteristicsService: EconomizerCharacteristicsService,
    private readonly boilerCharacteristicsService: BoilerCharacteristicsService,
    private readonly fuelCompositionsService: FuelCompositionsService,
    private readonly furnaceCharacteristicsService: FurnaceCharacteristicsService,
    private readonly convectivePackagesService: ConvectivePackagesService,
    private readonly stateRepository: StateRepository,
  ) {}

  calculate(createSimulationStateDto: CreateStateDto): State {
    const economizerCharacteristic =
      this.economizerCharacteristicsService.calculate();
    const boilerCharacteristics = this.boilerCharacteristicsService.calculate(
      createSimulationStateDto.boilerCharacteristics,
    );
    const fuelComposition = this.fuelCompositionsService.calculate({
      createFuelCompositionDto: createSimulationStateDto.fuelComposition,
      boilerCharacreristics: {
        gasInletTemperature: boilerCharacteristics.gasInletTemperature,
      },
    });
    const furnaceCharacteristics = this.furnaceCharacteristicsService.calculate(
      {
        createFurnaceCharacteristicDto:
          createSimulationStateDto.furnaceCharacteristics,
      },
    );
    const convectivePackagesParameters =
      this.convectivePackagesService.calculate({
        createConvectivePackageDtos:
          createSimulationStateDto.convectivePackagesParameters,
      });

    return new State({
      economizerCharacteristic,
      boilerCharacteristics,
      fuelComposition,
      furnaceCharacteristics,
      convectivePackagesParameters,
    });
  }

  create(createSimulationStateDto: CreateStateDto): void {
    const simulationState = this.calculate(createSimulationStateDto);
    this.stateRepository.create(simulationState);
  }
  update(updateSimulationStateDto: UpdateStateDto): void {
    const currentState = this.stateRepository.getCurrent();
    if (!currentState) {
      throw new BadRequestException('Simulation state not created yet');
    }
    if (!updateSimulationStateDto) return;
    const updatedEconomizerCharacteristic = null;
    let updatedBoilerCharacteristics: BoilerCharacteristic = null;
    let updatedFuelComposition: FuelComposition = null;
    let updatedFurnaceCharacteristics: FurnaceCharacteristic = null;
    let updatedConvectivePackagesParameters: ConvectivePackage[] = null;

    if (updateSimulationStateDto.boilerCharacteristics) {
      updatedBoilerCharacteristics =
        this.boilerCharacteristicsService.calculate(
          updateSimulationStateDto.boilerCharacteristics,
        );
      updatedFuelComposition = this.fuelCompositionsService.calculate({
        createFuelCompositionDto:
          updateSimulationStateDto.fuelComposition ||
          currentState.fuelComposition,
        boilerCharacreristics: {
          gasInletTemperature: updatedBoilerCharacteristics.gasInletTemperature,
        },
      });
    }
    if (updateSimulationStateDto.fuelComposition) {
      updatedFuelComposition = this.fuelCompositionsService.calculate({
        createFuelCompositionDto: updateSimulationStateDto.fuelComposition,
        boilerCharacreristics: {
          gasInletTemperature: updatedBoilerCharacteristics.gasInletTemperature,
        },
      });
    }
    if (updateSimulationStateDto.furnaceCharacteristics) {
      updatedFurnaceCharacteristics =
        this.furnaceCharacteristicsService.calculate({
          createFurnaceCharacteristicDto:
            updateSimulationStateDto.furnaceCharacteristics,
        });
    }
    if (updateSimulationStateDto.convectivePackagesParameters) {
      updatedConvectivePackagesParameters =
        this.convectivePackagesService.calculate({
          createConvectivePackageDtos:
            updateSimulationStateDto.convectivePackagesParameters,
        });
    }

    this.stateRepository.update({
      economizerCharacteristic: updatedEconomizerCharacteristic,
      boilerCharacteristics: updatedBoilerCharacteristics,
      fuelComposition: updatedFuelComposition,
      furnaceCharacteristics: updatedFurnaceCharacteristics,
      convectivePackagesParameters: updatedConvectivePackagesParameters,
    });
  }
  public reset(): void {
    this.stateRepository.clear();
  }
  getCurrent(): State {
    const state = this.stateRepository.getCurrent();
    return state;
  }
}
