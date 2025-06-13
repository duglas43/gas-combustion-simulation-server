import { Injectable } from '@nestjs/common';
import { FurnaceHeatBalanceRepository } from './repositories';
import { CalculateFurnaceHeatBalanceParams } from './interfaces';

@Injectable()
export class FurnaceHeatBalancesService {
  constructor(
    private readonly furnaceHeatBalanceRepository: FurnaceHeatBalanceRepository,
  ) {}

  public async calculate(params: CalculateFurnaceHeatBalanceParams) {
    const parameterM0 = 0.4;
    const luminousFlameFillingCoefficient = 0.1;
    const blackBodyRadiationCoefficient = 20.53e-8;
    const screenPollutionCoefficient =
      params.furnaceCharacteristic.screenContaminationFactor;
    const furnaceExitTemperatureSet = 844;

    const combustionProductEnthalpyExit =
      (params.alphaBurnerCombustionMaterialBalance.theoreticalCO2Volume *
        (1.604309582 +
          0.001133138 * furnaceExitTemperatureSet +
          -0.000000860416 * furnaceExitTemperatureSet ** 2 +
          0.000000000468441 * furnaceExitTemperatureSet ** 3 +
          -1.44713e-13 * furnaceExitTemperatureSet ** 4 +
          1.822707e-17 * furnaceExitTemperatureSet ** 5) +
        params.alphaBurnerCombustionMaterialBalance.theoreticalSO2Volume *
          (0.607026715343734 +
            3.08631797297832e-4 * furnaceExitTemperatureSet +
            -1.59369965554858e-7 * furnaceExitTemperatureSet ** 2 +
            1.63637023130679e-11 * furnaceExitTemperatureSet ** 3 +
            1.25572787709454e-14 * furnaceExitTemperatureSet ** 4 +
            -3.03012265579358e-18 * furnaceExitTemperatureSet ** 5) +
        params.alphaBurnerCombustionMaterialBalance
          .theoreticalWaterVaporVolume *
          (1.498317949 +
            0.000102932 * furnaceExitTemperatureSet +
            0.000000244654 * furnaceExitTemperatureSet ** 2 +
            -0.000000000156126 * furnaceExitTemperatureSet ** 3 +
            4.36681e-14 * furnaceExitTemperatureSet ** 4 +
            -5.05709e-18 * furnaceExitTemperatureSet ** 5) +
        params.alphaBurnerCombustionMaterialBalance.theoreticalNitrogenVolume *
          (1.29747332 +
            -0.000010563 * furnaceExitTemperatureSet +
            0.00000024181 * furnaceExitTemperatureSet ** 2 +
            -0.000000000183389 * furnaceExitTemperatureSet ** 3 +
            5.85924e-14 * furnaceExitTemperatureSet ** 4 +
            -7.03381e-18 * furnaceExitTemperatureSet ** 5) +
        params.alphaBurnerCombustionMaterialBalance.theoreticalOxygenVolume *
          (1.306450711 +
            0.000150251 * furnaceExitTemperatureSet +
            0.000000172284 * furnaceExitTemperatureSet ** 2 +
            -0.000000000232114 * furnaceExitTemperatureSet ** 3 +
            1.01527e-13 * furnaceExitTemperatureSet ** 4 +
            -1.53025e-17 * furnaceExitTemperatureSet ** 5)) *
      furnaceExitTemperatureSet;

    const combustionAirEnthalpy =
      params.combustionMaterialBalanceTemperature.theoreticalWetAirConsumption *
      params.temperatureCharacteristic.combustionAirHeatCapacity *
      params.temperatureCharacteristic.combustionAirTemperature;

    const airFractionFromAirPreheater = params.alphaBurnerCoefficient;
    const heatInputToFurnaceFromAir =
      airFractionFromAirPreheater * combustionAirEnthalpy +
      params.airLeakage.actualFurnaceAirLeakage *
        params.heatBalance.surroundingAirEnthalpy;

    const usefulHeatReleaseInFurnace =
      params.heatBalance.availableHeatInputToBoiler *
        ((100 -
          params.heatBalance
            .heatLossDueToChemicalIncompleteCombustionPercentage) /
          100) +
      heatInputToFurnaceFromAir -
      params.heatBalance.heatInputFromAir;
    const assumedAdiabaticCombustionTemperature = 2200;
    const actualAdiabaticCombustionTemperature =
      usefulHeatReleaseInFurnace /
      (params.alphaFurnaceAvgCombustionMaterialBalance.theoreticalCO2Volume *
        (1.604309582 +
          0.001133138 * assumedAdiabaticCombustionTemperature +
          -0.000000860416 * assumedAdiabaticCombustionTemperature ** 2 +
          0.000000000468441 * assumedAdiabaticCombustionTemperature ** 3 +
          -1.44713e-13 * assumedAdiabaticCombustionTemperature ** 4 +
          1.822707e-17 * assumedAdiabaticCombustionTemperature ** 5) +
        params.alphaFurnaceAvgCombustionMaterialBalance.theoreticalSO2Volume *
          (0.607026715343734 +
            3.08631797297832e-4 * assumedAdiabaticCombustionTemperature +
            -1.59369965554858e-7 * assumedAdiabaticCombustionTemperature ** 2 +
            1.63637023130679e-11 * assumedAdiabaticCombustionTemperature ** 3 +
            1.25572787709454e-14 * assumedAdiabaticCombustionTemperature ** 4 +
            -3.03012265579358e-18 *
              assumedAdiabaticCombustionTemperature ** 5) +
        params.alphaFurnaceAvgCombustionMaterialBalance
          .theoreticalWaterVaporVolume *
          (1.498317949 +
            0.000102932 * assumedAdiabaticCombustionTemperature +
            0.000000244654 * assumedAdiabaticCombustionTemperature ** 2 +
            -0.000000000156126 * assumedAdiabaticCombustionTemperature ** 3 +
            4.36681e-14 * assumedAdiabaticCombustionTemperature ** 4 +
            -5.05709e-18 * assumedAdiabaticCombustionTemperature ** 5) +
        params.alphaFurnaceAvgCombustionMaterialBalance
          .theoreticalNitrogenVolume *
          (1.29747332 +
            -0.000010563 * assumedAdiabaticCombustionTemperature +
            0.00000024181 * assumedAdiabaticCombustionTemperature ** 2 +
            -0.000000000183389 * assumedAdiabaticCombustionTemperature ** 3 +
            5.85924e-14 * assumedAdiabaticCombustionTemperature ** 4 +
            -7.03381e-18 * assumedAdiabaticCombustionTemperature ** 5) +
        params.alphaFurnaceAvgCombustionMaterialBalance
          .theoreticalOxygenVolume *
          (1.306450711 +
            0.000150251 * assumedAdiabaticCombustionTemperature +
            0.000000172284 * assumedAdiabaticCombustionTemperature ** 2 +
            -0.000000000232114 * assumedAdiabaticCombustionTemperature ** 3 +
            1.01527e-13 * assumedAdiabaticCombustionTemperature ** 4 +
            -1.53025e-17 * assumedAdiabaticCombustionTemperature ** 5));

    const imbalancePercentage = Math.abs(
      ((assumedAdiabaticCombustionTemperature -
        actualAdiabaticCombustionTemperature) *
        100) /
        actualAdiabaticCombustionTemperature,
    );
    const averageHeatCapacityProductsInFurnace =
      (usefulHeatReleaseInFurnace - combustionProductEnthalpyExit) /
      (actualAdiabaticCombustionTemperature - furnaceExitTemperatureSet);

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
        (actualAdiabaticCombustionTemperature + 273.15) ** 3);

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
              .specificVolumeFractionTriatomicGases *
              params.furnaceCharacteristic.effectiveRadiatingLayerThickness,
          )) -
        1) *
      (1 - (0.37 * (blackBodyRadiationCoefficient + 273.15)) / 1000) *
      params.alphaFurnaceAvgCombustionMaterialBalance
        .specificVolumeFractionTriatomicGases;

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
      (1.2 / (1 + params.alphaBurnerCoefficient ** 2)) *
      ((1.6 * (furnaceExitTemperatureSet + 273.15)) / 1000 - 0.5) *
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
    const combustionProductExitTemperature =
      (actualAdiabaticCombustionTemperature + 273.15) /
        (calculatedParameterM *
          bugerCriterion ** 0.3 *
          (1 / boltzmannCriterion) ** 0.6 +
          1) -
      273;
    const calculatedImbalance = Math.abs(
      ((combustionProductExitTemperature - furnaceExitTemperatureSet) * 100) /
        combustionProductExitTemperature,
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

    const furnaceHeatBalance = this.furnaceHeatBalanceRepository.create({
      blackBodyRadiationCoefficient,
      screenPollutionCoefficient,
      parameterM0,
      luminousFlameFillingCoefficient,
      furnaceExitTemperatureSet,
      combustionProductEnthalpyExit,
      combustionAirEnthalpy,
      airFractionFromAirPreheater,
      heatInputToFurnaceFromAir,
      usefulHeatReleaseInFurnace,
      assumedAdiabaticCombustionTemperature,
      actualAdiabaticCombustionTemperature,
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
      combustionProductExitTemperature,
      calculatedImbalance,
      heatAbsorbedByRadiativeScreens,
      specificHeatLoadRadiativeScreens,
      specificHeatTensionFurnaceVolume,
      enthalpyIncrementHeatedHeatCarrier,
    });
    return furnaceHeatBalance;
  }
}
