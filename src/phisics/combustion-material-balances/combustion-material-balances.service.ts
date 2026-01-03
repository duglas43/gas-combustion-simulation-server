import { Injectable } from '@nestjs/common';
import { CalculateCombustionMaterialBalanceParams } from './interfaces';
import { CombustionMaterialBalance } from './entities';

@Injectable()
export class CombustionMaterialBalancesService {
  public calculate(params: CalculateCombustionMaterialBalanceParams) {
    const alphaNames = [
      'alpha',
      'alphaBurner',
      'alphaFurnace',
      'alphaFurnaceAvg',
      'alphaConvectivePackage1',
      'alphaConvectivePackage1Avg',
      'alphaConvectivePackage2',
      'alphaConvectivePackage2Avg',
      'alphaEconomizerAvg',
      'alphaEconomizer',
      'alphaFlueGas',
    ];
    const combustionMaterialBalances: CombustionMaterialBalance[] = [];

    for (const alphaName of alphaNames) {
      const airExcessCoefficient = params.airExcessCoefficients.find(
        (alpha) => alpha.name === alphaName,
      );
      const theoreticalCO2Volume =
        0.01 *
        (params.fuelComposition.carbonDioxidePercentage +
          params.fuelComposition.carbonMonoxidePercentage +
          params.fuelComposition.methanePercentage +
          2 * params.fuelComposition.ethanePercentage +
          3 * params.fuelComposition.propanePercentage +
          4 *
            (params.fuelComposition.nButanePercentage +
              params.fuelComposition.isoButanePercentage) +
          5 * params.fuelComposition.pentanePercentage +
          2 * params.fuelComposition.acetylenePercentage +
          3 * params.fuelComposition.ethylenePercentage +
          4 * params.fuelComposition.propylenePercentage +
          2 * params.fuelComposition.butylenePercentage);

      const theoreticalWaterVaporVolume =
        0.01 *
          (params.fuelComposition.hydrogenPercentage +
            params.fuelComposition.hydrogenSulfidePercentage +
            2 * params.fuelComposition.methanePercentage +
            3 * params.fuelComposition.ethanePercentage +
            4 * params.fuelComposition.propanePercentage +
            5 *
              (params.fuelComposition.nButanePercentage +
                params.fuelComposition.isoButanePercentage) +
            6 * params.fuelComposition.pentanePercentage +
            2 * params.fuelComposition.acetylenePercentage +
            3 * params.fuelComposition.ethylenePercentage +
            4 * params.fuelComposition.propylenePercentage +
            0.5 * params.fuelComposition.butylenePercentage) +
        0.00124 *
          (params.boilerCharacteristics.airHumidityForCombustion *
            airExcessCoefficient.value *
            params.combustionMaterialBalanceTemperature
              .theoreticalDryAirConsumption +
            params.boilerCharacteristics.gasHumidityForCombustion);

      const theoreticalNitrogenVolume =
        0.79 *
          params.combustionMaterialBalanceTemperature
            .theoreticalDryAirConsumption *
          airExcessCoefficient.value +
        0.01 * params.fuelComposition.nitrogenPercentage;

      const theoreticalOxygenVolume =
        0.21 *
          (airExcessCoefficient.value - 1) *
          params.combustionMaterialBalanceTemperature
            .theoreticalDryAirConsumption +
        0.01 * params.fuelComposition.oxygenPercentage;

      const totalWetCombustionProductsVolume =
        theoreticalCO2Volume +
        0 +
        theoreticalWaterVaporVolume +
        theoreticalNitrogenVolume +
        theoreticalOxygenVolume;

      const specificVolumeFractionRO2 =
        theoreticalCO2Volume / totalWetCombustionProductsVolume;

      const specificVolumeFractionWaterVapor =
        theoreticalWaterVaporVolume / totalWetCombustionProductsVolume;

      const specificVolumeFractionTriatomicGases =
        specificVolumeFractionRO2 + specificVolumeFractionWaterVapor;

      const partialPressureRO2 =
        specificVolumeFractionRO2 *
        params.boilerCharacteristics.flueGasAbsolutePressure;

      const partialPressureWaterVapor =
        specificVolumeFractionWaterVapor *
        params.boilerCharacteristics.flueGasAbsolutePressure;

      const partialPressureTriatomicGases =
        specificVolumeFractionTriatomicGases *
        params.boilerCharacteristics.flueGasAbsolutePressure;

      const recirculationRate = 0;

      const specificMassOfCombustionProducts =
        ((theoreticalCO2Volume * 1.977 +
          theoreticalWaterVaporVolume * 0.8041 +
          theoreticalNitrogenVolume * 1.251 +
          theoreticalOxygenVolume * 1.429) /
          totalWetCombustionProductsVolume +
          params.boilerCharacteristics.gasHumidityForCombustion * 0.001) *
          (1 + recirculationRate) +
        1.306 *
          (airExcessCoefficient.value +
            airExcessCoefficient.value * recirculationRate) *
          totalWetCombustionProductsVolume;

      const combustionMaterialBalance = new CombustionMaterialBalance({
        airExcessCoefficientName: airExcessCoefficient.name,
        actualWetAirConsumption:
          airExcessCoefficient.value *
          params.combustionMaterialBalanceTemperature
            .theoreticalWetAirConsumption,
        theoreticalCO2Volume,
        theoreticalSO2Volume: 0,
        theoreticalWaterVaporVolume,
        theoreticalNitrogenVolume,
        theoreticalOxygenVolume,
        totalWetCombustionProductsVolume,
        specificVolumeFractionRO2,
        specificVolumeFractionWaterVapor,
        specificVolumeFractionTriatomicGases,
        partialPressureRO2,
        partialPressureWaterVapor,
        partialPressureTriatomicGases,
        recirculationRate,
        specificMassOfCombustionProducts,
      });
      combustionMaterialBalances.push(combustionMaterialBalance);
    }
    return combustionMaterialBalances;
  }
}
