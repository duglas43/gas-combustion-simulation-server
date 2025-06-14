import { Injectable } from '@nestjs/common';
import { CalculateCombustionMaterialBalanceTemperatureParams } from './interfaces';
import { CombustionMaterialBalanceTemperature } from './entities';

@Injectable()
export class CombustionMaterialBalanceTemperaturesService {
  public async calculate(
    params: CalculateCombustionMaterialBalanceTemperatureParams,
  ) {
    const lowerHeatingValue =
      0.01 *
      (10790 * params.fuelComposition.hydrogenPercentage +
        12640 * params.fuelComposition.carbonMonoxidePercentage +
        35880 * params.fuelComposition.methanePercentage +
        64300 * params.fuelComposition.ethanePercentage +
        93180 * params.fuelComposition.propanePercentage +
        123500 * params.fuelComposition.nButanePercentage +
        122700 * params.fuelComposition.isoButanePercentage +
        156600 * params.fuelComposition.pentanePercentage +
        59500 * params.fuelComposition.acetylenePercentage +
        88400 * params.fuelComposition.propylenePercentage +
        113800 * params.fuelComposition.butylenePercentage);

    const higherHeatingValue =
      0.01 *
      (12750 * params.fuelComposition.hydrogenPercentage +
        12640 * params.fuelComposition.carbonMonoxidePercentage +
        39800 * params.fuelComposition.methanePercentage +
        70300 * params.fuelComposition.ethanePercentage +
        101200 * params.fuelComposition.propanePercentage +
        113800 * params.fuelComposition.nButanePercentage +
        132900 * params.fuelComposition.isoButanePercentage +
        169300 * params.fuelComposition.pentanePercentage +
        36000 * params.fuelComposition.acetylenePercentage +
        91900 * params.fuelComposition.propylenePercentage +
        121400 * params.fuelComposition.butylenePercentage);

    const theoreticalDryAirConsumption =
      0.0476 *
      (2 * params.fuelComposition.methanePercentage +
        3.5 * params.fuelComposition.ethanePercentage +
        5 * params.fuelComposition.propanePercentage +
        6.5 *
          (params.fuelComposition.nButanePercentage +
            params.fuelComposition.isoButanePercentage) +
        8 * params.fuelComposition.pentanePercentage +
        0.5 * params.fuelComposition.hydrogenPercentage +
        3 * params.fuelComposition.acetylenePercentage +
        4.5 * params.fuelComposition.propylenePercentage +
        6 * params.fuelComposition.butylenePercentage +
        2.5 * params.fuelComposition.carbonMonoxidePercentage -
        0.01 * params.fuelComposition.oxygenPercentage);
    const theoreticalWetAirConsumption =
      theoreticalDryAirConsumption +
      0.00124 *
        params.boilerCharacteristics.airHumidityForCombustion *
        theoreticalDryAirConsumption;

    const combustionMaterialBalanceTemperature =
      new CombustionMaterialBalanceTemperature({
        lowerHeatingValue,
        higherHeatingValue,
        theoreticalDryAirConsumption,
        theoreticalWetAirConsumption,
      });
    return combustionMaterialBalanceTemperature;
  }
}
