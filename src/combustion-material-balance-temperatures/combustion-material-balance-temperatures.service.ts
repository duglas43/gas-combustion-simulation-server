import { Injectable } from '@nestjs/common';
import { CalculateCombustionMaterialBalanceTemperatureParams } from './interfaces';
import { CombustionMaterialBalanceTemperature } from './entities';

@Injectable()
export class CombustionMaterialBalanceTemperaturesService {
  public calculate(
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
      (39820 * params.fuelComposition.methanePercentage +
        70310 * params.fuelComposition.ethanePercentage +
        101210 * params.fuelComposition.propanePercentage +
        133800 * params.fuelComposition.nButanePercentage +
        132960 * params.fuelComposition.isoButanePercentage +
        169270 * params.fuelComposition.pentanePercentage +
        12750 * params.fuelComposition.hydrogenPercentage +
        63039 * params.fuelComposition.acetylenePercentage +
        91945 * params.fuelComposition.propylenePercentage +
        121434 * params.fuelComposition.butylenePercentage +
        12640 * params.fuelComposition.carbonMonoxidePercentage);

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
