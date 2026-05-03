import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStateDto, StateDto, UpdateStateDto } from './dtos';
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
import { ResourcesService } from 'src/phisics/resources/resources.service';
import { Resource } from 'src/phisics/resources/entities';
import { AirLeakagesService } from 'src/phisics/air-leakages/air-leakages.service';
import { AirLeakage } from 'src/phisics/air-leakages/entities';

@Injectable()
export class StateService {
  public constructor(
    private readonly economizerCharacteristicsService: EconomizerCharacteristicsService,
    private readonly boilerCharacteristicsService: BoilerCharacteristicsService,
    private readonly fuelCompositionsService: FuelCompositionsService,
    private readonly furnaceCharacteristicsService: FurnaceCharacteristicsService,
    private readonly convectivePackagesService: ConvectivePackagesService,
    private readonly resourcesService: ResourcesService,
    private readonly airLeakagesService: AirLeakagesService,
    private readonly stateRepository: StateRepository,
  ) {}

  calculate(createStateDto: CreateStateDto): State {
    const economizerCharacteristic =
      this.economizerCharacteristicsService.calculate();
    const boilerCharacteristics = this.boilerCharacteristicsService.calculate(
      createStateDto.boilerCharacteristics,
    );
    const airLeakage = this.airLeakagesService.calculate({
      boilerCharacreristics: boilerCharacteristics,
      airLeakage: createStateDto.airLeakage,
    });
    const fuelComposition = this.fuelCompositionsService.calculate({
      createFuelCompositionDto: createStateDto.fuelComposition,
      boilerCharacreristics: {
        gasInletTemperature: boilerCharacteristics.gasInletTemperature,
      },
    });
    const furnaceCharacteristics = this.furnaceCharacteristicsService.calculate(
      {
        createFurnaceCharacteristicDto: createStateDto.furnaceCharacteristics,
      },
    );
    const convectivePackagesParameters =
      this.convectivePackagesService.calculate({
        createConvectivePackageDtos:
          createStateDto.convectivePackagesParameters,
      });
    const resource = this.resourcesService.calculate({
      fuelRemaining: createStateDto.resource.fuelRemaining,
    });

    return new State({
      economizerCharacteristic,
      boilerCharacteristics,
      airLeakage,
      fuelComposition,
      furnaceCharacteristics,
      convectivePackagesParameters,
      resource,
    });
  }

  create(createStateDto: CreateStateDto): void {
    const simulationState = this.calculate(createStateDto);
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
    let updatedAirLeakage: AirLeakage = null;
    let updatedFuelComposition: FuelComposition = null;
    let updatedFurnaceCharacteristics: FurnaceCharacteristic = null;
    let updatedConvectivePackagesParameters: ConvectivePackage[] = null;
    let updatedResource: Resource = null;

    const boilerCharacteristicsDto = {
      ...currentState.boilerCharacteristics,
      ...updateSimulationStateDto.boilerCharacteristics,
    };
    const airLeakageDto = {
      ...currentState.airLeakage,
      ...updateSimulationStateDto.airLeakage,
    };

    if (updateSimulationStateDto.boilerCharacteristics) {
      updatedBoilerCharacteristics =
        this.boilerCharacteristicsService.calculate(boilerCharacteristicsDto);
    }

    const effectiveBoilerCharacteristics =
      updatedBoilerCharacteristics || currentState.boilerCharacteristics;

    if (
      updateSimulationStateDto.boilerCharacteristics ||
      updateSimulationStateDto.airLeakage
    ) {
      updatedAirLeakage = this.airLeakagesService.calculate({
        boilerCharacreristics: effectiveBoilerCharacteristics,
        airLeakage: airLeakageDto,
      });
    }

    if (
      updateSimulationStateDto.boilerCharacteristics ||
      updateSimulationStateDto.fuelComposition
    ) {
      updatedFuelComposition = this.fuelCompositionsService.calculate({
        createFuelCompositionDto: {
          ...currentState.fuelComposition,
          ...updateSimulationStateDto.fuelComposition,
        },
        boilerCharacreristics: {
          gasInletTemperature:
            effectiveBoilerCharacteristics.gasInletTemperature,
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

    if (updateSimulationStateDto.resource) {
      updatedResource = this.resourcesService.calculate({
        fuelRemaining: updateSimulationStateDto.resource.fuelRemaining,
      });
    }

    this.stateRepository.update({
      economizerCharacteristic: updatedEconomizerCharacteristic,
      boilerCharacteristics: updatedBoilerCharacteristics,
      airLeakage: updatedAirLeakage,
      fuelComposition: updatedFuelComposition,
      furnaceCharacteristics: updatedFurnaceCharacteristics,
      convectivePackagesParameters: updatedConvectivePackagesParameters,
      resource: updatedResource,
    });
  }

  public replace(state: State): void {
    this.stateRepository.update(state);
  }
  public reset(): void {
    this.stateRepository.clear();
  }
  public getCurrentDto(): StateDto {
    const state = this.stateRepository.getCurrent();
    if (!state) return null;
    return new StateDto(state);
  }

  getCurrent(): State {
    const state = this.stateRepository.getCurrent();
    return state;
  }
}
