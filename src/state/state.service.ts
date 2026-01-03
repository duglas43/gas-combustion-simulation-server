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

@Injectable()
export class StateService {
  public state: State | null = null;

  public constructor(
    private readonly economizerCharacteristicsService: EconomizerCharacteristicsService,
    private readonly boilerCharacteristicsService: BoilerCharacteristicsService,
    private readonly fuelCompositionsService: FuelCompositionsService,
    private readonly furnaceCharacteristicsService: FurnaceCharacteristicsService,
    private readonly convectivePackagesService: ConvectivePackagesService,
  ) {}

  create(createSimulationStateDto: CreateStateDto): void {
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

    const simulationState = new State({
      economizerCharacteristic,
      boilerCharacteristics,
      fuelComposition,
      furnaceCharacteristics,
      convectivePackagesParameters,
    });
    this.state = simulationState;
  }
  update(updateSimulationStateDto: UpdateStateDto): void {
    if (!this.state) {
      throw new BadRequestException('Simulation state not created yet');
    }
    if (!updateSimulationStateDto) return;
    const updatedEconomizerCharacteristic =
      this.economizerCharacteristicsService.calculate();
    let updatedBoilerCharacteristics: BoilerCharacteristic =
      this.state.boilerCharacteristics;
    let updatedFuelComposition: FuelComposition = this.state.fuelComposition;
    let updatedFurnaceCharacteristics: FurnaceCharacteristic =
      this.state.furnaceCharacteristics;
    let updatedConvectivePackagesParameters: ConvectivePackage[] =
      this.state.convectivePackagesParameters;

    if (updateSimulationStateDto.boilerCharacteristics) {
      updatedBoilerCharacteristics =
        this.boilerCharacteristicsService.calculate(
          updateSimulationStateDto.boilerCharacteristics,
        );
      updatedFuelComposition = this.fuelCompositionsService.calculate({
        createFuelCompositionDto:
          updateSimulationStateDto.fuelComposition ||
          this.state.fuelComposition,
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

    this.state = new State({
      economizerCharacteristic: updatedEconomizerCharacteristic,
      boilerCharacteristics: updatedBoilerCharacteristics,
      fuelComposition: updatedFuelComposition,
      furnaceCharacteristics: updatedFurnaceCharacteristics,
      convectivePackagesParameters: updatedConvectivePackagesParameters,
    });
  }
  public reset(): void {
    this.state = null;
  }
  getCurrent(): State {
    return this.state;
  }
}
