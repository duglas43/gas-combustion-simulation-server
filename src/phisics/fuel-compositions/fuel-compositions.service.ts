import { Injectable } from '@nestjs/common';
import { CalculateFuelCompositionParams } from './interfaces';
import { FuelComposition } from './entities';

@Injectable()
export class FuelCompositionsService {
  public calculate(params: CalculateFuelCompositionParams) {
    const { boilerCharacreristics } = params;
    const fuelComposition = new FuelComposition({
      ...params.createFuelCompositionDto,
      methaneHeatCapacity:
        1.54908042 +
        0.000719365 * boilerCharacreristics.gasInletTemperature +
        2.43134e-6 * boilerCharacreristics.gasInletTemperature ** 2 +
        -4.79443e-9 * boilerCharacreristics.gasInletTemperature ** 3 +
        4.30216e-12 * boilerCharacreristics.gasInletTemperature ** 4 +
        -1.50641e-15 * boilerCharacreristics.gasInletTemperature ** 5,
      ethaneHeatCapacity:
        2.211388112 +
        0.002810953 * boilerCharacreristics.gasInletTemperature +
        3.15253e-7 * boilerCharacreristics.gasInletTemperature ** 2 +
        -1.58086e-9 * boilerCharacreristics.gasInletTemperature ** 3 +
        9.33858e-13 * boilerCharacreristics.gasInletTemperature ** 4 +
        -1.60256e-16 * boilerCharacreristics.gasInletTemperature ** 5,
      propaneHeatCapacity:
        3.046305944 +
        0.004794336 * boilerCharacreristics.gasInletTemperature +
        -9.4705e-7 * boilerCharacreristics.gasInletTemperature ** 2 +
        -1.29975e-9 * boilerCharacreristics.gasInletTemperature ** 3 +
        1.13855e-12 * boilerCharacreristics.gasInletTemperature ** 4 +
        -2.72436e-16 * boilerCharacreristics.gasInletTemperature ** 5,
      nButaneHeatCapacity:
        4.127592657 +
        0.005936645 * boilerCharacreristics.gasInletTemperature +
        -1.4782e-6 * boilerCharacreristics.gasInletTemperature ** 2 +
        2.76005e-10 * boilerCharacreristics.gasInletTemperature ** 3 +
        -1.34105e-12 * boilerCharacreristics.gasInletTemperature ** 4 +
        8.8141e-16 * boilerCharacreristics.gasInletTemperature ** 5,
      isoButaneHeatCapacity:
        5.12743007 +
        0.00744045 * boilerCharacreristics.gasInletTemperature +
        -3.30121e-6 * boilerCharacreristics.gasInletTemperature ** 2 +
        4.42177e-9 * boilerCharacreristics.gasInletTemperature ** 3 +
        -6.1961e-12 * boilerCharacreristics.gasInletTemperature ** 4 +
        2.85256e-15 * boilerCharacreristics.gasInletTemperature ** 5,
      pentaneHeatCapacity:
        5.12743007 +
        0.00744045 * boilerCharacreristics.gasInletTemperature +
        -3.30121e-6 * boilerCharacreristics.gasInletTemperature ** 2 +
        4.42177e-9 * boilerCharacreristics.gasInletTemperature ** 3 +
        -6.1961e-12 * boilerCharacreristics.gasInletTemperature ** 4 +
        2.85256e-15 * boilerCharacreristics.gasInletTemperature ** 5,
      hydrogenHeatCapacity:
        1.285314861 +
        0.0001585 * boilerCharacreristics.gasInletTemperature +
        -4.77872e-7 * boilerCharacreristics.gasInletTemperature ** 2 +
        7.55826e-10 * boilerCharacreristics.gasInletTemperature ** 3 +
        -5.20124e-13 * boilerCharacreristics.gasInletTemperature ** 4 +
        1.33782e-16 * boilerCharacreristics.gasInletTemperature ** 5,
      ethyleneHeatCapacity:
        1.834188112 +
        0.002810953 * boilerCharacreristics.gasInletTemperature +
        3.15253e-7 * boilerCharacreristics.gasInletTemperature ** 2 +
        -1.58086e-9 * boilerCharacreristics.gasInletTemperature ** 3 +
        9.33858e-13 * boilerCharacreristics.gasInletTemperature ** 4 +
        -1.60256e-16 * boilerCharacreristics.gasInletTemperature ** 5,
      propyleneHeatCapacity:
        2.738305944 +
        0.004794336 * boilerCharacreristics.gasInletTemperature +
        -9.4705e-7 * boilerCharacreristics.gasInletTemperature ** 2 +
        -1.29975e-9 * boilerCharacreristics.gasInletTemperature ** 3 +
        1.13855e-12 * boilerCharacreristics.gasInletTemperature ** 4 +
        -2.72436e-16 * boilerCharacreristics.gasInletTemperature ** 5,
      acetyleneHeatCapacity:
        1.925388112 +
        0.002810953 * boilerCharacreristics.gasInletTemperature +
        3.15253e-7 * boilerCharacreristics.gasInletTemperature ** 2 +
        -1.58086e-9 * boilerCharacreristics.gasInletTemperature ** 3 +
        9.33858e-13 * boilerCharacreristics.gasInletTemperature ** 4 +
        -1.60256e-16 * boilerCharacreristics.gasInletTemperature ** 5,
      carbonDioxideHeatCapacity:
        1.604309582 +
        0.001133138 * boilerCharacreristics.gasInletTemperature +
        -8.60416e-7 * boilerCharacreristics.gasInletTemperature ** 2 +
        4.68441e-10 * boilerCharacreristics.gasInletTemperature ** 3 +
        -1.44713e-13 * boilerCharacreristics.gasInletTemperature ** 4 +
        1.82271e-17 * boilerCharacreristics.gasInletTemperature ** 5,
      carbonMonoxideHeatCapacity:
        1.306704025 +
        -6.71883e-6 * boilerCharacreristics.gasInletTemperature +
        2.59388e-7 * boilerCharacreristics.gasInletTemperature ** 2 +
        -1.60902e-10 * boilerCharacreristics.gasInletTemperature ** 3 +
        1.14164e-14 * boilerCharacreristics.gasInletTemperature ** 4 +
        1.04936e-17 * boilerCharacreristics.gasInletTemperature ** 5,
      nitrogenHeatCapacity:
        1.29747332 +
        -0.000010563 * boilerCharacreristics.gasInletTemperature +
        2.4181e-7 * boilerCharacreristics.gasInletTemperature ** 2 +
        -1.83389e-10 * boilerCharacreristics.gasInletTemperature ** 3 +
        5.85924e-14 * boilerCharacreristics.gasInletTemperature ** 4 +
        -7.03381e-18 * boilerCharacreristics.gasInletTemperature ** 5,
      oxygenHeatCapacity:
        1.306450711 +
        0.000150251 * boilerCharacreristics.gasInletTemperature +
        1.72284e-7 * boilerCharacreristics.gasInletTemperature ** 2 +
        -2.32114e-10 * boilerCharacreristics.gasInletTemperature ** 3 +
        1.01527e-13 * boilerCharacreristics.gasInletTemperature ** 4 +
        -1.53025e-17 * boilerCharacreristics.gasInletTemperature ** 5,
      hydrogenSulfideHeatCapacity:
        1.507006993 +
        0.000224906 * boilerCharacreristics.gasInletTemperature +
        2.55915e-7 * boilerCharacreristics.gasInletTemperature ** 2 +
        -1.1655e-11 * boilerCharacreristics.gasInletTemperature ** 3 +
        -2.53497e-13 * boilerCharacreristics.gasInletTemperature ** 4 +
        1.28205e-16 * boilerCharacreristics.gasInletTemperature ** 5,
      butyleneHeatCapacity:
        3.789592657 +
        0.005936645 * boilerCharacreristics.gasInletTemperature +
        -1.4782e-6 * boilerCharacreristics.gasInletTemperature ** 2 +
        2.76005e-10 * boilerCharacreristics.gasInletTemperature ** 3 +
        -1.34105e-12 * boilerCharacreristics.gasInletTemperature ** 4 +
        8.8141e-16 * boilerCharacreristics.gasInletTemperature ** 5,
    });
    return fuelComposition;
  }
}
