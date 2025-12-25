import { Injectable } from '@nestjs/common';
import { CalculateHeatBalanceParams } from './interfaces';
import { HeatBalance } from './entities';

@Injectable()
export class HeatBalancesService {
  public calculate(params: CalculateHeatBalanceParams) {
    const heatLossDueToChemicalIncompleteCombustionPercentage = 0;
    const heatInputFromFuel =
      params.temperatureCharacteristics.gasMixtureHeatCapacity *
      params.boilerCharacteristics.gasInletTemperature;
    const heatInputFromAir = 0;
    const availableHeatInputToBoiler =
      heatInputFromFuel +
      heatInputFromAir +
      params.combustionMaterialBalanceTemperature.lowerHeatingValue;
    const flueGasTemperatureSet = params.flueGasTemperatureSet;
    const flueGasEnthalpy =
      (params.alphaFlueGasCombustionMaterialBalance.theoreticalCO2Volume *
        (1.604309582 +
          0.001133138 * flueGasTemperatureSet -
          8.60416e-7 * flueGasTemperatureSet ** 2 +
          4.68441e-10 * flueGasTemperatureSet ** 3 -
          1.44713e-13 * flueGasTemperatureSet ** 4 +
          1.82271e-17 * flueGasTemperatureSet ** 5) +
        params.alphaFlueGasCombustionMaterialBalance.theoreticalSO2Volume *
          (0.607026715343734 +
            0.000308632 * flueGasTemperatureSet -
            1.5937e-7 * flueGasTemperatureSet ** 2 +
            1.63637e-11 * flueGasTemperatureSet ** 3 +
            1.25573e-14 * flueGasTemperatureSet ** 4 -
            3.03012e-18 * flueGasTemperatureSet ** 5) +
        params.alphaFlueGasCombustionMaterialBalance
          .theoreticalWaterVaporVolume *
          (1.498317949 +
            0.000102932 * flueGasTemperatureSet +
            2.44654e-7 * flueGasTemperatureSet ** 2 -
            1.56126e-10 * flueGasTemperatureSet ** 3 +
            4.36681e-14 * flueGasTemperatureSet ** 4 -
            5.05709e-18 * flueGasTemperatureSet ** 5) +
        params.alphaFlueGasCombustionMaterialBalance.theoreticalNitrogenVolume *
          (1.29747332 -
            0.000010563 * flueGasTemperatureSet +
            2.4181e-7 * flueGasTemperatureSet ** 2 -
            1.83389e-10 * flueGasTemperatureSet ** 3 +
            5.85924e-14 * flueGasTemperatureSet ** 4 -
            7.03381e-18 * flueGasTemperatureSet ** 5) +
        params.alphaFlueGasCombustionMaterialBalance.theoreticalOxygenVolume *
          (1.306450711 +
            0.000150251 * flueGasTemperatureSet +
            1.72284e-7 * flueGasTemperatureSet ** 2 -
            2.32114e-10 * flueGasTemperatureSet ** 3 +
            1.01527e-13 * flueGasTemperatureSet ** 4 -
            1.53025e-17 * flueGasTemperatureSet ** 5)) *
      flueGasTemperatureSet;
    const surroundingAirEnthalpy =
      params.combustionMaterialBalanceTemperature.theoreticalWetAirConsumption *
      params.temperatureCharacteristics.boilerRoomAirHeatCapacity *
      params.boilerCharacteristics.roomAirTemperature;
    const heatLossWithFlueGases =
      flueGasEnthalpy -
      (params.alphaFlueGasCoefficient - 1) * surroundingAirEnthalpy;
    const heatLossWithFlueGasesPercentage =
      (heatLossWithFlueGases * 100) / availableHeatInputToBoiler;

    const heatLossDueToChemicalIncompleteCombustion =
      (heatLossDueToChemicalIncompleteCombustionPercentage *
        availableHeatInputToBoiler) /
      100;

    const heatLossThroughOuterWallsPercentage =
      ((0.255252565 +
        47.36314226 / params.boilerCharacteristics.nominalSteamProduction +
        -834.3872002 /
          params.boilerCharacteristics.nominalSteamProduction ** 2 +
        8019.779143 / params.boilerCharacteristics.nominalSteamProduction ** 3 +
        -32277.77998 /
          params.boilerCharacteristics.nominalSteamProduction ** 4 +
        44135.89981 /
          params.boilerCharacteristics.nominalSteamProduction ** 5) *
        100) /
      params.boilerCharacteristics.loadPercentage;
    const heatLossThroughOuterWalls =
      (availableHeatInputToBoiler * heatLossThroughOuterWallsPercentage) / 100;

    const boilerEfficiencyGross =
      100 -
      heatLossWithFlueGasesPercentage -
      heatLossDueToChemicalIncompleteCombustionPercentage -
      heatLossThroughOuterWallsPercentage;

    const totalHeatLoss =
      heatLossWithFlueGases +
      heatLossDueToChemicalIncompleteCombustion +
      heatLossThroughOuterWalls;

    const blowdownWaterFlow =
      (0.01 *
        params.boilerCharacteristics.blowdownPercentage *
        params.boilerCharacteristics.nominalSteamProduction *
        params.boilerCharacteristics.loadPercentage) /
      100;

    const usefulHeatUtilized =
      (((params.boilerCharacteristics.nominalSteamProduction *
        params.boilerCharacteristics.loadPercentage) /
        100) *
        (2529.561501 +
          689.7698653 *
            (params.boilerCharacteristics.excessPressureInBoiler + 0.1) ** 0.5 +
          -945.4105533 *
            (params.boilerCharacteristics.excessPressureInBoiler + 0.1) +
          798.3009619 *
            (params.boilerCharacteristics.excessPressureInBoiler + 0.1) ** 1.5 +
          -357.523749 *
            (params.boilerCharacteristics.excessPressureInBoiler + 0.1) ** 2 +
          63.1843854 *
            (params.boilerCharacteristics.excessPressureInBoiler + 0.1) ** 2.5 -
          (4.21728893897003 +
            -4.24888399827776e-4 *
              params.boilerCharacteristics.feedWaterTemperature +
            -1.90766415583401e-5 *
              params.boilerCharacteristics.feedWaterTemperature ** 2 +
            3.73685094570715e-7 *
              params.boilerCharacteristics.feedWaterTemperature ** 3 +
            -1.82785185562934e-9 *
              params.boilerCharacteristics.feedWaterTemperature ** 4 +
            3.30764930384364e-12 *
              params.boilerCharacteristics.feedWaterTemperature ** 5) *
            params.boilerCharacteristics.feedWaterTemperature) +
        blowdownWaterFlow *
          (63.3125516389845 +
            1600.35159333891 *
              (params.boilerCharacteristics.excessPressureInBoiler + 0.1) **
                0.5 +
            -2000.28710382556 *
              (params.boilerCharacteristics.excessPressureInBoiler + 0.1) +
            1744.33493642283 *
              (params.boilerCharacteristics.excessPressureInBoiler + 0.1) **
                1.5 +
            -785.768886299272 *
              (params.boilerCharacteristics.excessPressureInBoiler + 0.1) ** 2 +
            140.026972257752 *
              (params.boilerCharacteristics.excessPressureInBoiler + 0.1) **
                2.5 -
            (4.21728893897003 +
              -4.24888399827776e-4 *
                params.boilerCharacteristics.feedWaterTemperature +
              -1.90766415583401e-5 *
                params.boilerCharacteristics.feedWaterTemperature ** 2 +
              3.73685094570715e-7 *
                params.boilerCharacteristics.feedWaterTemperature ** 3 +
              -1.82785185562934e-9 *
                params.boilerCharacteristics.feedWaterTemperature ** 4 +
              3.30764930384364e-12 *
                params.boilerCharacteristics.feedWaterTemperature ** 5) *
              params.boilerCharacteristics.feedWaterTemperature)) *
      1000;

    const calculatedHourlyFuelConsumption =
      (usefulHeatUtilized * 100) /
      (availableHeatInputToBoiler * boilerEfficiencyGross);

    const heatedHeatCarrierFlow =
      (params.boilerCharacteristics.actualSteamProduction + blowdownWaterFlow) *
      1000;

    const heatRetentionCoefficient =
      1 -
      heatLossThroughOuterWallsPercentage /
        (heatLossThroughOuterWallsPercentage + boilerEfficiencyGross);

    const heatBalance = new HeatBalance({
      heatLossDueToChemicalIncompleteCombustionPercentage,
      heatInputFromFuel,
      heatInputFromAir,
      availableHeatInputToBoiler,
      flueGasTemperatureSet,
      flueGasEnthalpy,
      surroundingAirEnthalpy,
      heatLossWithFlueGases,
      heatLossWithFlueGasesPercentage,
      heatLossDueToChemicalIncompleteCombustion,
      heatLossThroughOuterWallsPercentage,
      heatLossThroughOuterWalls,
      boilerEfficiencyGross,
      totalHeatLoss,
      blowdownWaterFlow,
      usefulHeatUtilized,
      calculatedHourlyFuelConsumption,
      heatedHeatCarrierFlow,
      heatRetentionCoefficient,
    });
    return heatBalance;
  }
}
