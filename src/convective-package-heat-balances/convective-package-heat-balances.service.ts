import { Injectable } from '@nestjs/common';
import { ConvectivePackageHeatBalanceRepository } from './repositories';
import { CalculateConvectivePackageHeatBalanceParams } from './interfaces';

@Injectable()
export class ConvectivePackageHeatBalancesService {
  constructor(
    private readonly convectivePackageHeatBalanceRepository: ConvectivePackageHeatBalanceRepository,
  ) {}

  public async calculate(params: CalculateConvectivePackageHeatBalanceParams) {
    const averageHeatAbsorptionCoefficient = 0.7;
    const sumAngularCoefficients = 0.949;
    const furnaceExitWindowArea = 2.327;
    const geometricAdjustmentFactor = 1;
    const screenWallBlacknessDegree = 0.8;
    const heatEfficiencyCoefficient = 0.8;
    const heatUtilizationCoefficient = 0.95;
    const packageExitTemperature = 291.4;

    const combustionProductEnthalpyExit =
      (params.alphaConvectivePackageCombustionMaterialBalance
        .theoreticalCO2Volume *
        (1.604309582 +
          0.001133138 * packageExitTemperature +
          -8.60416e-7 * packageExitTemperature ** 2 +
          4.68441e-10 * packageExitTemperature ** 3 +
          -1.44713e-13 * packageExitTemperature ** 4 +
          1.82271e-17 * packageExitTemperature ** 5) +
        params.alphaConvectivePackageCombustionMaterialBalance
          .theoreticalWaterVaporVolume *
          (1.498317949 +
            0.000109232 * packageExitTemperature +
            -2.44654e-7 * packageExitTemperature ** 2 +
            2.46157e-10 * packageExitTemperature ** 3 +
            -1.56162e-13 * packageExitTemperature ** 4 +
            -5.57059e-18 * packageExitTemperature ** 5) +
        params.alphaConvectivePackageCombustionMaterialBalance
          .theoreticalOxygenVolume *
          (1.306450711 +
            0.000150251 * packageExitTemperature +
            1.72284e-7 * packageExitTemperature ** 2 +
            -2.32114e-10 * packageExitTemperature ** 3 +
            1.01527e-13 * packageExitTemperature ** 4 +
            -1.53025e-17 * packageExitTemperature ** 5) +
        params.alphaConvectivePackageCombustionMaterialBalance
          .theoreticalNitrogenVolume *
          (1.29747332 +
            -0.000010563 * packageExitTemperature +
            2.4181e-7 * packageExitTemperature ** 2 +
            -1.83389e-10 * packageExitTemperature ** 3 +
            5.85924e-14 * packageExitTemperature ** 4 +
            -7.03381e-18 * packageExitTemperature ** 5) +
        params.alphaConvectivePackageCombustionMaterialBalance
          .theoreticalSO2Volume *
          (0.607026715 +
            0.000308632 * packageExitTemperature +
            -1.5937e-7 * packageExitTemperature ** 2 +
            1.63367e-11 * packageExitTemperature ** 3 +
            1.25573e-14 * packageExitTemperature ** 4 +
            -3.03012e-18 * packageExitTemperature ** 5)) *
      packageExitTemperature;

    const heatBalanceAbsorption =
      params.heatBalance.heatRetentionCoefficient *
      (params.furnaceHeatBalance.combustionProductEnthalpyExit -
        combustionProductEnthalpyExit +
        (params.convecivePackageNumber === 1
          ? params.airLeakage.actualFirstConvectiveAirLeakage
          : params.airLeakage.actualSecondConvectiveAirLeakage) *
          params.heatBalance.surroundingAirEnthalpy);

    const radiativeHeatLoad = 0;
    const heatReceivedByRadiation =
      (radiativeHeatLoad * furnaceExitWindowArea * sumAngularCoefficients) /
      params.heatBalance.calculatedHourlyFuelConsumption;

    const enthalpyIncrease =
      ((heatBalanceAbsorption + heatReceivedByRadiation) *
        params.heatBalance.calculatedHourlyFuelConsumption) /
      params.heatBalance.heatedHeatCarrierFlow;

    const heatedMediumTemperature =
      14.46082904 +
      391.6645325 *
        (params.boilerCharacteristics.excessPressureInBoiler + 0.1) ** 0.5 +
      -515.7577364 *
        (params.boilerCharacteristics.excessPressureInBoiler + 0.1) +
      380.9431696 *
        (params.boilerCharacteristics.excessPressureInBoiler + 0.1) ** 1.5 +
      -218.8244384 *
        (params.boilerCharacteristics.excessPressureInBoiler + 0.1) ** 2 +
      40.22947271 *
        (params.boilerCharacteristics.excessPressureInBoiler + 0.1) ** 2.5;

    const logarithmicTemperatureDifference =
      ((params.furnaceHeatBalance.combustionProductExitTemperature -
        heatedMediumTemperature -
        (packageExitTemperature - heatedMediumTemperature)) *
        geometricAdjustmentFactor) /
      Math.log(
        (params.furnaceHeatBalance.combustionProductExitTemperature -
          heatedMediumTemperature) /
          (packageExitTemperature - heatedMediumTemperature),
      );
    const averageCombustionTemperature =
      (params.furnaceHeatBalance.combustionProductExitTemperature +
        packageExitTemperature) /
      2;

    const averageCombustionVelocity =
      (params.heatBalance.calculatedHourlyFuelConsumption *
        params.alphaConvectiveAvgCombustionMaterialBalance
          .totalWetCombustionProductsVolume *
        (averageCombustionTemperature + 273.15)) /
      (3600 *
        params.convectivePackageCharacteristics.channelCrossSectionArea *
        273.15);

    const reynoldsCriterion =
      (averageCombustionVelocity *
        params.convectivePackageCharacteristics.equivalentChannelDiameter) /
      (1.196865e-5 +
        2.791535e-8 * averageCombustionTemperature +
        -3.514694e-11 * averageCombustionTemperature ** 2 +
        2.273281e-14 * averageCombustionTemperature ** 3 +
        -7.561365e-18 * averageCombustionTemperature ** 4 +
        1.046736e-21 * averageCombustionTemperature ** 5);

    const prandtlCriterion =
      0.738892754 +
      1.5913e-4 * averageCombustionTemperature +
      -5.713939e-7 * averageCombustionTemperature ** 2 +
      1.035111e-9 * averageCombustionTemperature ** 3 +
      -1.1723e-12 * averageCombustionTemperature ** 4 +
      5.29942e-16 * averageCombustionTemperature ** 5;

    const correctionCoefficientCs =
      ((1 +
        (2 * params.convectivePackageCharacteristics.relativeTubePitchInRow -
          3) *
          (1 - params.convectivePackageCharacteristics.relativeRowPitch / 2)) **
        3) **
      -2;

    const correctionCoefficientCz = 1;
    const convectiveHeatTransferCoefficient =
      ((0.2 *
        (0.081620792 +
          0.000057156 * averageCombustionTemperature +
          -7.139937e-8 * averageCombustionTemperature ** 2 +
          9.573195e-11 * averageCombustionTemperature ** 3 +
          -1.042761e-13 * averageCombustionTemperature ** 4 +
          4.124561e-17 * averageCombustionTemperature ** 5)) /
        (params.convectivePackageCharacteristics.outerTubeDiameter * 0.001)) *
      reynoldsCriterion ** 0.65 *
      prandtlCriterion ** 0.33 *
      correctionCoefficientCs *
      correctionCoefficientCz;

    const threeAtomGasRayAttenuationCoefficient =
      ((7.8 +
        16 *
          params.alphaConvectiveAvgCombustionMaterialBalance
            .specificVolumeFractionWaterVapor) /
        (3.16 *
          Math.sqrt(
            params.alphaConvectiveAvgCombustionMaterialBalance
              .partialPressureTriatomicGases *
              params.convectivePackageCharacteristics
                .effectiveRadiatingLayerThickness,
          )) -
        1) *
      (1 - (0.37 * (packageExitTemperature + 273.15)) / 1000) *
      params.alphaConvectiveAvgCombustionMaterialBalance
        .specificVolumeFractionTriatomicGases;

    const radiativeLayerOpticalThickness =
      threeAtomGasRayAttenuationCoefficient *
      params.boilerCharacteristics.flueGasAbsolutePressure *
      params.convectivePackageCharacteristics.effectiveRadiatingLayerThickness;

    const effectiveBlacknessDegree =
      1 - Math.exp(-radiativeLayerOpticalThickness);

    const averageWallTemperature = heatedMediumTemperature + 25;

    const radiativeHeatTransferCoefficient =
      params.furnaceHeatBalance.blackBodyRadiationCoefficient *
      (screenWallBlacknessDegree + 1) *
      0.5 *
      effectiveBlacknessDegree *
      (averageCombustionTemperature + 273.15) ** 3 *
      ((1 -
        ((averageWallTemperature + 273.15) /
          (averageCombustionTemperature + 273.15)) **
          3.6) /
        (1 -
          (averageWallTemperature + 273.15) /
            (averageCombustionTemperature + 273.15)));

    const heatTransferCoefficient =
      heatEfficiencyCoefficient *
      heatUtilizationCoefficient *
      (convectiveHeatTransferCoefficient + radiativeHeatTransferCoefficient);

    const heatTransferByEquation =
      (heatTransferCoefficient *
        params.convectivePackageCharacteristics
          .convectivePackageHeatSurfaceArea *
        logarithmicTemperatureDifference) /
      params.heatBalance.calculatedHourlyFuelConsumption;

    const exitTemperatureControlValue =
      (params.furnaceHeatBalance.combustionProductEnthalpyExit -
        heatTransferByEquation / params.heatBalance.heatRetentionCoefficient +
        (params.convecivePackageNumber === 1
          ? params.airLeakage.actualFirstConvectiveAirLeakage
          : params.airLeakage.actualSecondConvectiveAirLeakage) *
          params.heatBalance.surroundingAirEnthalpy) /
      (params.alphaConvectivePackageCombustionMaterialBalance
        .theoreticalCO2Volume *
        (1.604309582 +
          0.001133138 * packageExitTemperature +
          -8.60416e-7 * packageExitTemperature ** 2 +
          4.68441e-10 * packageExitTemperature ** 3 +
          -1.44713e-13 * packageExitTemperature ** 4 +
          1.82271e-17 * packageExitTemperature ** 5) +
        params.alphaConvectivePackageCombustionMaterialBalance
          .theoreticalSO2Volume *
          (0.607026715 +
            0.003008632 * packageExitTemperature +
            -1.5937e-7 * packageExitTemperature ** 2 +
            1.63637e-11 * packageExitTemperature ** 3 +
            -2.57357e-14 * packageExitTemperature ** 4 +
            -3.03012e-18 * packageExitTemperature ** 5) +
        params.alphaConvectivePackageCombustionMaterialBalance
          .theoreticalWaterVaporVolume *
          (1.306704025 +
            -6.71883e-6 * packageExitTemperature +
            2.59388e-7 * packageExitTemperature ** 2 +
            -1.60902e-10 * packageExitTemperature ** 3 +
            1.14164e-14 * packageExitTemperature ** 4 +
            1.04936e-17 * packageExitTemperature ** 5) +
        params.alphaConvectivePackageCombustionMaterialBalance
          .theoreticalNitrogenVolume *
          (1.306450711 +
            0.000150251 * packageExitTemperature +
            1.72284e-7 * packageExitTemperature ** 2 +
            -2.32114e-10 * packageExitTemperature ** 3 +
            1.01527e-13 * packageExitTemperature ** 4 +
            -1.53025e-17 * packageExitTemperature ** 5) +
        params.alphaConvectivePackageCombustionMaterialBalance
          .theoreticalOxygenVolume *
          (1.498317949 +
            0.0001585 * packageExitTemperature +
            -4.77872e-7 * packageExitTemperature ** 2 +
            7.55826e-10 * packageExitTemperature ** 3 +
            -5.20124e-13 * packageExitTemperature ** 4 +
            1.33782e-16 * packageExitTemperature ** 5));

    const heatBalanceImbalance = Math.abs(
      ((heatBalanceAbsorption - heatTransferByEquation) * 100) /
        heatTransferByEquation,
    );

    const specificHeatTransferred =
      (params.heatBalance.calculatedHourlyFuelConsumption *
        heatBalanceAbsorption) /
      params.convectivePackageCharacteristics.convectivePackageHeatSurfaceArea;

    const convectivePackageHeatBalance =
      this.convectivePackageHeatBalanceRepository.create({
        convectivePackageId: 1,
        averageHeatAbsorptionCoefficient,
        sumAngularCoefficients,
        furnaceExitWindowArea,
        geometricAdjustmentFactor,
        screenWallBlacknessDegree,
        heatEfficiencyCoefficient,
        heatUtilizationCoefficient,
        packageExitTemperature,
        combustionProductEnthalpyExit,
        heatBalanceAbsorption,
        radiativeHeatLoad,
        heatReceivedByRadiation,
        enthalpyIncrease,
        heatedMediumTemperature,
        logarithmicTemperatureDifference,
        averageCombustionTemperature,
        averageCombustionVelocity,
        reynoldsCriterion,
        prandtlCriterion,
        correctionCoefficientCs,
        correctionCoefficientCz,
        convectiveHeatTransferCoefficient,
        threeAtomGasRayAttenuationCoefficient,
        radiativeLayerOpticalThickness,
        effectiveBlacknessDegree,
        averageWallTemperature,
        radiativeHeatTransferCoefficient,
        heatTransferCoefficient,
        heatTransferByEquation,
        exitTemperatureControlValue,
        heatBalanceImbalance,
        specificHeatTransferred,
      });

    return convectivePackageHeatBalance;
  }
}
