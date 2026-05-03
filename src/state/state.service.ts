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
import { StateSnapshotRepository } from './snapshots/repositories';
import { Laws } from 'src/laws/entities';
import {
  FindStateSnapshotsDto,
  StateSnapshotDto,
  StateSnapshotsListDto,
} from './snapshots/dtos';
import { StateSnapshot } from './snapshots/entities';
import { And, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

@Injectable()
export class StateService {
  private forecastSnapshots: StateSnapshot[] = [];

  public constructor(
    private readonly economizerCharacteristicsService: EconomizerCharacteristicsService,
    private readonly boilerCharacteristicsService: BoilerCharacteristicsService,
    private readonly fuelCompositionsService: FuelCompositionsService,
    private readonly furnaceCharacteristicsService: FurnaceCharacteristicsService,
    private readonly convectivePackagesService: ConvectivePackagesService,
    private readonly resourcesService: ResourcesService,
    private readonly airLeakagesService: AirLeakagesService,
    private readonly stateRepository: StateRepository,
    private readonly stateSnapshotRepository: StateSnapshotRepository,
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

  create(createStateDto: CreateStateDto): State {
    const simulationState = this.calculate(createStateDto);
    this.stateRepository.create(simulationState);
    return simulationState;
  }

  update(updateSimulationStateDto: UpdateStateDto): State {
    const currentState = this.stateRepository.getCurrent();
    if (!currentState) {
      throw new BadRequestException('Simulation state not created yet');
    }
    if (!updateSimulationStateDto) return currentState;
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

    return this.stateRepository.getCurrent();
  }

  public replace(state: State): void {
    this.stateRepository.update(state);
  }
  public reset(): void {
    this.stateRepository.clear();
  }

  public async saveSnapshot(params: {
    state: State;
    timestamp: number;
    time: Date;
    laws?: Laws;
  }): Promise<StateSnapshot> {
    const snapshot = this.stateSnapshotRepository.create({
      time: params.time,
      timestamp: params.timestamp,
      state: this.clone(params.state),
      laws: this.clone(params.laws ?? {}),
    });

    await this.stateSnapshotRepository.upsert(snapshot, ['timestamp']);

    return this.stateSnapshotRepository.findOne({
      where: { timestamp: params.timestamp },
    });
  }

  public saveForecastSnapshots(snapshots: StateSnapshot[]): void {
    this.forecastSnapshots = snapshots.map((snapshot) =>
      this.stateSnapshotRepository.create(snapshot),
    );
  }

  public async getRecentSnapshots(limit = 20): Promise<StateSnapshot[]> {
    const snapshots = await this.stateSnapshotRepository.find({
      order: { timestamp: 'DESC' },
      take: limit,
    });

    return snapshots.reverse();
  }

  public async findSnapshots(
    params: FindStateSnapshotsDto,
  ): Promise<StateSnapshotsListDto> {
    const snapshots = await this.stateSnapshotRepository.find({
      where: {
        timestamp: And(
          MoreThanOrEqual(params.from),
          LessThanOrEqual(params.to),
        ),
      },
      order: { timestamp: 'ASC' },
    });

    const historical = snapshots.map(
      (snapshot) => new StateSnapshotDto(snapshot),
    );
    const forecast = this.forecastSnapshots.map(
      (snapshot) => new StateSnapshotDto(snapshot),
    );

    return new StateSnapshotsListDto({
      historical,
      current: historical[historical.length - 1] ?? null,
      forecast,
    });
  }

  public async clearSnapshots(): Promise<void> {
    await this.stateSnapshotRepository.clear();
    this.forecastSnapshots = [];
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

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
  }
}
