import { Injectable } from '@nestjs/common';
import { CalculateFurnaceHeatBalanceParams } from './interfaces';
import { FurnaceHeatBalance } from './entities';

@Injectable()
export class FurnaceHeatBalancesService {
  public calculate(params: CalculateFurnaceHeatBalanceParams) {
    const parameterM0 = 0.4;
    const luminousFlameFillingCoefficient = 0.1;
    const blackBodyRadiationCoefficient = 20.53e-8;
    const screenPollutionCoefficient =
      params.furnaceCharacteristic.screenContaminationFactor;
    const acceptedFurnaceExitTemperature =
      params.acceptedFurnaceExitTemperature;
    const acceptedAdiabaticCombustionTemperature =
      params.acceptedAdiabaticCombustionTemperature;

    const combustionProductEnthalpyExit =
      (params.alphaFurnaceCombustionMaterialBalance.theoreticalCO2Volume *
        (1.604309582 +
          0.001133138 * acceptedFurnaceExitTemperature -
          8.60416e-7 * acceptedFurnaceExitTemperature ** 2 +
          4.68441e-10 * acceptedFurnaceExitTemperature ** 3 -
          1.44713e-13 * acceptedFurnaceExitTemperature ** 4 +
          1.82271e-17 * acceptedFurnaceExitTemperature ** 5) +
        params.alphaFurnaceCombustionMaterialBalance.theoreticalSO2Volume *
          (0.607026715343734 +
            0.000308632 * acceptedFurnaceExitTemperature -
            1.5937e-7 * acceptedFurnaceExitTemperature ** 2 +
            1.63637e-11 * acceptedFurnaceExitTemperature ** 3 +
            1.25573e-14 * acceptedFurnaceExitTemperature ** 4 -
            3.03012e-18 * acceptedFurnaceExitTemperature ** 5) +
        params.alphaFurnaceCombustionMaterialBalance
          .theoreticalWaterVaporVolume *
          (1.498317949 +
            0.000102932 * acceptedFurnaceExitTemperature +
            2.44654e-7 * acceptedFurnaceExitTemperature ** 2 -
            1.56126e-10 * acceptedFurnaceExitTemperature ** 3 +
            4.36681e-14 * acceptedFurnaceExitTemperature ** 4 -
            5.05709e-18 * acceptedFurnaceExitTemperature ** 5) +
        params.alphaFurnaceCombustionMaterialBalance.theoreticalNitrogenVolume *
          (1.29747332 -
            0.000010563 * acceptedFurnaceExitTemperature +
            2.4181e-7 * acceptedFurnaceExitTemperature ** 2 -
            1.83389e-10 * acceptedFurnaceExitTemperature ** 3 +
            5.85924e-14 * acceptedFurnaceExitTemperature ** 4 -
            7.03381e-18 * acceptedFurnaceExitTemperature ** 5) +
        params.alphaFurnaceCombustionMaterialBalance.theoreticalOxygenVolume *
          (1.306450711 +
            0.000150251 * acceptedFurnaceExitTemperature +
            1.72284e-7 * acceptedFurnaceExitTemperature ** 2 -
            2.32114e-10 * acceptedFurnaceExitTemperature ** 3 +
            1.01527e-13 * acceptedFurnaceExitTemperature ** 4 -
            1.53025e-17 * acceptedFurnaceExitTemperature ** 5)) *
      acceptedFurnaceExitTemperature;

    const combustionAirEnthalpy =
      params.combustionMaterialBalanceTemperature.theoreticalWetAirConsumption *
      params.temperatureCharacteristic.combustionAirHeatCapacity *
      params.temperatureCharacteristic.combustionAirTemperature;

    const airFractionFromAirPreheater =
      params.alphaFurnaceCoefficient -
      params.airLeakage.actualFurnaceAirLeakage -
      (params.alphaFlueGasCoefficient - 1) *
        params.temperatureCharacteristic.recirculationRate;
    const heatInputToFurnaceFromAir =
      airFractionFromAirPreheater * combustionAirEnthalpy +
      params.airLeakage.actualFurnaceAirLeakage *
        params.heatBalance.surroundingAirEnthalpy;

    // ='МБ и ТБ'!C34*((100-'МБ и ТБ'!C31)/100)+C12-'МБ и ТБ'!C33
    const usefulHeatReleaseInFurnace =
      params.heatBalance.availableHeatInputToBoiler *
        ((100 -
          params.heatBalance
            .heatLossDueToChemicalIncompleteCombustionPercentage) /
          100) +
      heatInputToFurnaceFromAir -
      params.heatBalance.heatInputFromAir;

    const calculatedAdiabaticCombustionTemperature =
      usefulHeatReleaseInFurnace /
      (params.alphaFurnaceAvgCombustionMaterialBalance.theoreticalCO2Volume *
        (1.604309582 +
          0.001133138 * acceptedAdiabaticCombustionTemperature -
          8.60416e-7 * acceptedAdiabaticCombustionTemperature ** 2 +
          4.68441e-10 * acceptedAdiabaticCombustionTemperature ** 3 -
          1.44713e-13 * acceptedAdiabaticCombustionTemperature ** 4 +
          1.82271e-17 * acceptedAdiabaticCombustionTemperature ** 5) +
        params.alphaFurnaceAvgCombustionMaterialBalance.theoreticalSO2Volume *
          (0.607026715343734 +
            0.000308632 * acceptedAdiabaticCombustionTemperature -
            1.5937e-7 * acceptedAdiabaticCombustionTemperature ** 2 +
            1.63637e-11 * acceptedAdiabaticCombustionTemperature ** 3 +
            1.25573e-14 * acceptedAdiabaticCombustionTemperature ** 4 -
            3.03012e-18 * acceptedAdiabaticCombustionTemperature ** 5) +
        params.alphaFurnaceAvgCombustionMaterialBalance
          .theoreticalWaterVaporVolume *
          (1.498317949 +
            0.000102932 * acceptedAdiabaticCombustionTemperature +
            2.44654e-7 * acceptedAdiabaticCombustionTemperature ** 2 -
            1.56126e-10 * acceptedAdiabaticCombustionTemperature ** 3 +
            4.36681e-14 * acceptedAdiabaticCombustionTemperature ** 4 -
            5.05709e-18 * acceptedAdiabaticCombustionTemperature ** 5) +
        params.alphaFurnaceAvgCombustionMaterialBalance
          .theoreticalNitrogenVolume *
          (1.29747332 -
            0.000010563 * acceptedAdiabaticCombustionTemperature +
            2.4181e-7 * acceptedAdiabaticCombustionTemperature ** 2 -
            1.83389e-10 * acceptedAdiabaticCombustionTemperature ** 3 +
            5.85924e-14 * acceptedAdiabaticCombustionTemperature ** 4 -
            7.03381e-18 * acceptedAdiabaticCombustionTemperature ** 5) +
        params.alphaFurnaceAvgCombustionMaterialBalance
          .theoreticalOxygenVolume *
          (1.306450711 +
            0.000150251 * acceptedAdiabaticCombustionTemperature +
            1.72284e-7 * acceptedAdiabaticCombustionTemperature ** 2 -
            2.32114e-10 * acceptedAdiabaticCombustionTemperature ** 3 +
            1.01527e-13 * acceptedAdiabaticCombustionTemperature ** 4 -
            1.53025e-17 * acceptedAdiabaticCombustionTemperature ** 5));

    const imbalancePercentage = Math.abs(
      ((acceptedAdiabaticCombustionTemperature -
        calculatedAdiabaticCombustionTemperature) *
        100) /
        calculatedAdiabaticCombustionTemperature,
    );
    const averageHeatCapacityProductsInFurnace =
      (usefulHeatReleaseInFurnace - combustionProductEnthalpyExit) /
      (calculatedAdiabaticCombustionTemperature -
        acceptedFurnaceExitTemperature);

    const averageThermalEfficiencyCoefficient =
      ((params.furnaceCharacteristic.firstScreenArea *
        params.furnaceCharacteristic.firstScreenAngleCoefficient +
        params.furnaceCharacteristic.secondScreenArea *
          params.furnaceCharacteristic.secondScreenAngleCoefficient +
        params.furnaceCharacteristic.thirdScreenArea *
          params.furnaceCharacteristic.thirdScreenAngleCoefficient +
        params.furnaceCharacteristic.fourthScreenArea *
          params.furnaceCharacteristic.fourthScreenAngleCoefficient +
        params.furnaceCharacteristic.fifthScreenArea *
          params.furnaceCharacteristic.fifthScreenAngleCoefficient) *
        screenPollutionCoefficient) /
      params.furnaceCharacteristic.totalWallSurfaceArea;

    const boltzmannCriterion =
      (params.heatBalance.heatRetentionCoefficient *
        params.heatBalance.calculatedHourlyFuelConsumption *
        averageHeatCapacityProductsInFurnace) /
      (blackBodyRadiationCoefficient *
        averageThermalEfficiencyCoefficient *
        params.furnaceCharacteristic.totalWallSurfaceArea *
        (calculatedAdiabaticCombustionTemperature + 273.15) ** 3);

    const maxTemperatureZoneHeight =
      (((params.furnaceCharacteristic.burnersInFirstRow *
        params.heatBalance.calculatedHourlyFuelConsumption) /
        params.furnaceCharacteristic.totalBurnersInBoiler) *
        params.furnaceCharacteristic.firstBurnerRowHeight) /
      ((params.furnaceCharacteristic.totalBurnersInBoiler *
        params.heatBalance.calculatedHourlyFuelConsumption) /
        params.furnaceCharacteristic.totalBurnersInBoiler);
    const relativeMaxTemperatureZonePosition =
      maxTemperatureZoneHeight / params.furnaceCharacteristic.furnaceHeight;

    const furnaceGasDilutionCoefficient =
      (params.alphaFurnaceAvgCombustionMaterialBalance
        .totalWetCombustionProductsVolume *
        (1 - params.temperatureCharacteristic.recirculationRate)) /
      (params.alphaFurnaceAvgCombustionMaterialBalance.theoreticalCO2Volume +
        params.alphaFurnaceAvgCombustionMaterialBalance.theoreticalSO2Volume +
        params.alphaFurnaceAvgCombustionMaterialBalance
          .theoreticalNitrogenVolume);

    const calculatedParameterM =
      parameterM0 *
      (1 - 0.4 * relativeMaxTemperatureZonePosition) *
      furnaceGasDilutionCoefficient ** 0.3333;

    const rayAttenuationCoefficientThreeAtomGases =
      ((7.8 +
        16 *
          params.alphaFurnaceAvgCombustionMaterialBalance
            .specificVolumeFractionWaterVapor) /
        (3.16 *
          Math.sqrt(
            params.alphaFurnaceAvgCombustionMaterialBalance
              .partialPressureTriatomicGases *
              params.furnaceCharacteristic.effectiveRadiatingLayerThickness,
          )) -
        1) *
      (1 - (0.37 * (acceptedFurnaceExitTemperature + 273.15)) / 1000) *
      params.alphaFurnaceAvgCombustionMaterialBalance
        .specificVolumeFractionTriatomicGases; // F22

    const carbonToHydrogenMassRatio =
      0.12 *
      ((1 / 4) * params.fuelComposition.methanePercentage +
        (2 / 6) * params.fuelComposition.ethanePercentage +
        (3 / 8) * params.fuelComposition.propanePercentage +
        (4 / 10) *
          (params.fuelComposition.nButanePercentage +
            params.fuelComposition.isoButanePercentage) +
        (5 / 12) * params.fuelComposition.pentanePercentage +
        (2 / 4) * params.fuelComposition.ethylenePercentage +
        (3 / 6) * params.fuelComposition.propylenePercentage +
        (4 / 8) * params.fuelComposition.butylenePercentage +
        (2 / 2) * params.fuelComposition.acetylenePercentage);

    const sootRayAttenuationCoefficient =
      (1.2 / (1 + params.alphaFurnaceCoefficient ** 2)) *
      ((1.6 * (acceptedFurnaceExitTemperature + 273.15)) / 1000 - 0.5) *
      carbonToHydrogenMassRatio ** 0.4;

    const furnaceMediumAbsorptionCoefficient =
      rayAttenuationCoefficientThreeAtomGases +
      luminousFlameFillingCoefficient * sootRayAttenuationCoefficient;

    const bugerCriterion =
      furnaceMediumAbsorptionCoefficient *
      params.boilerCharacteristics.flueGasAbsolutePressure *
      params.furnaceCharacteristic.effectiveRadiatingLayerThickness;

    const effectiveBugerCriterion =
      1.6 *
      Math.log(
        (1.4 * bugerCriterion ** 2 + bugerCriterion + 2) /
          (1.4 * bugerCriterion ** 2 - bugerCriterion + 2),
      );
    const calculatedFurnaceExitTemperature =
      (calculatedAdiabaticCombustionTemperature + 273.15) /
        (calculatedParameterM *
          effectiveBugerCriterion ** 0.3 *
          (1 / boltzmannCriterion) ** 0.6 +
          1) -
      273;
    const calculatedImbalance = Math.abs(
      ((calculatedFurnaceExitTemperature - acceptedFurnaceExitTemperature) *
        100) /
        calculatedFurnaceExitTemperature,
    );
    const heatAbsorbedByRadiativeScreens =
      params.heatBalance.heatRetentionCoefficient *
      (usefulHeatReleaseInFurnace - combustionProductEnthalpyExit);

    const specificHeatLoadRadiativeScreens =
      (params.heatBalance.calculatedHourlyFuelConsumption *
        heatAbsorbedByRadiativeScreens) /
      params.furnaceCharacteristic.totalRadiantHeatSurfaceArea;

    const specificHeatTensionFurnaceVolume =
      (params.heatBalance.calculatedHourlyFuelConsumption *
        usefulHeatReleaseInFurnace) /
      params.furnaceCharacteristic.furnaceVolume;

    const enthalpyIncrementHeatedHeatCarrier =
      (params.heatBalance.calculatedHourlyFuelConsumption *
        (heatAbsorbedByRadiativeScreens - 0)) /
      params.heatBalance.heatedHeatCarrierFlow;

    const furnaceHeatBalance = new FurnaceHeatBalance({
      blackBodyRadiationCoefficient,
      screenPollutionCoefficient,
      parameterM0,
      luminousFlameFillingCoefficient,
      acceptedFurnaceExitTemperature,
      combustionProductEnthalpyExit,
      combustionAirEnthalpy,
      airFractionFromAirPreheater,
      heatInputToFurnaceFromAir,
      usefulHeatReleaseInFurnace,
      acceptedAdiabaticCombustionTemperature,
      calculatedAdiabaticCombustionTemperature,
      imbalancePercentage,
      averageHeatCapacityProductsInFurnace,
      averageThermalEfficiencyCoefficient,
      boltzmannCriterion,
      maxTemperatureZoneHeight,
      relativeMaxTemperatureZonePosition,
      furnaceGasDilutionCoefficient,
      calculatedParameterM,
      rayAttenuationCoefficientThreeAtomGases,
      carbonToHydrogenMassRatio,
      sootRayAttenuationCoefficient,
      furnaceMediumAbsorptionCoefficient,
      bugerCriterion,
      effectiveBugerCriterion,
      calculatedFurnaceExitTemperature,
      calculatedImbalance,
      heatAbsorbedByRadiativeScreens,
      specificHeatLoadRadiativeScreens,
      specificHeatTensionFurnaceVolume,
      enthalpyIncrementHeatedHeatCarrier,
    });
    return furnaceHeatBalance;
  }
}
