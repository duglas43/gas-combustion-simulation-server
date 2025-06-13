import { Injectable } from '@nestjs/common';
import { TemperatureCharacteristicRepository } from './repositories';
import { CalculateTemperatureCharacteristicParams } from './interfaces';

@Injectable()
export class TemperatureCharacteristicsService {
  constructor(
    private readonly temperatureCharacteristicRepository: TemperatureCharacteristicRepository,
  ) {}

  public async calculate(params: CalculateTemperatureCharacteristicParams) {
    const temperatureCharacteristic =
      this.temperatureCharacteristicRepository.create({
        recirculationRate: 0,
        combustionAirTemperature:
          params.boilerCharacteristics.roomAirTemperature,
        gasMixtureHeatCapacity:
          (params.fuelComposition.methanePercentage *
            params.fuelComposition.methaneHeatCapacity +
            params.fuelComposition.ethanePercentage *
              params.fuelComposition.ethaneHeatCapacity +
            params.fuelComposition.propanePercentage *
              params.fuelComposition.propaneHeatCapacity +
            params.fuelComposition.nButanePercentage *
              params.fuelComposition.nButaneHeatCapacity +
            params.fuelComposition.isoButanePercentage *
              params.fuelComposition.isoButaneHeatCapacity +
            params.fuelComposition.pentanePercentage *
              params.fuelComposition.pentaneHeatCapacity +
            params.fuelComposition.hydrogenPercentage *
              params.fuelComposition.hydrogenHeatCapacity +
            params.fuelComposition.ethylenePercentage *
              params.fuelComposition.ethyleneHeatCapacity +
            params.fuelComposition.propylenePercentage *
              params.fuelComposition.propyleneHeatCapacity +
            params.fuelComposition.butylenePercentage *
              params.fuelComposition.butyleneHeatCapacity +
            params.fuelComposition.acetylenePercentage *
              params.fuelComposition.acetyleneHeatCapacity +
            params.fuelComposition.hydrogenSulfidePercentage *
              params.fuelComposition.hydrogenSulfideHeatCapacity +
            params.fuelComposition.carbonMonoxidePercentage *
              params.fuelComposition.carbonMonoxideHeatCapacity +
            params.fuelComposition.carbonDioxidePercentage *
              params.fuelComposition.carbonDioxideHeatCapacity +
            params.fuelComposition.nitrogenPercentage *
              params.fuelComposition.nitrogenHeatCapacity +
            params.fuelComposition.oxygenPercentage *
              params.fuelComposition.oxygenHeatCapacity) /
          100,
        boilerRoomAirHeatCapacity:
          1.323305621 +
          2.32677e-5 * params.boilerCharacteristics.roomAirTemperature +
          2.40222e-7 * params.boilerCharacteristics.roomAirTemperature ** 2 +
          -2.12806e-10 * params.boilerCharacteristics.roomAirTemperature ** 3 +
          7.96863e-14 * params.boilerCharacteristics.roomAirTemperature ** 4 +
          -1.14303e-17 * params.boilerCharacteristics.roomAirTemperature ** 5,
        combustionAirHeatCapacity:
          1.323305621 +
          2.32677e-5 * params.boilerCharacteristics.roomAirTemperature +
          2.40222e-7 * params.boilerCharacteristics.roomAirTemperature ** 2 +
          -2.12806e-10 * params.boilerCharacteristics.roomAirTemperature ** 3 +
          7.96863e-14 * params.boilerCharacteristics.roomAirTemperature ** 4 +
          -1.14303e-17 * params.boilerCharacteristics.roomAirTemperature ** 5,
      });
    return temperatureCharacteristic;
  }
}
