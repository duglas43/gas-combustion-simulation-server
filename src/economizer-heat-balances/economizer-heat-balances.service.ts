import { Injectable } from '@nestjs/common';
import { CalculateEconomizerHeatBalanceParams } from './interfaces';
import { EconomizerHeatBalance } from './entities';

@Injectable()
export class EconomizerHeatBalancesService {
  public calculate(params: CalculateEconomizerHeatBalanceParams) {
    const geometricAdjustmentFactor = 1;
    const heatEfficiencyCoefficient = 0.5;
    const heatUtilizationCoefficient = 1;
    const acceptedEconomizerExitTemperature =
      params.acceptedEconomizerExitTemperature;
    const combustionProductEnthalpyExit =
      (params.alphaEconomizerCombustionMaterialBalance.theoreticalCO2Volume *
        (1.604309582 +
          0.001133138 * acceptedEconomizerExitTemperature +
          -0.000000860416 * acceptedEconomizerExitTemperature ** 2 +
          0.000000000468441 * acceptedEconomizerExitTemperature ** 3 +
          -1.44713e-13 * acceptedEconomizerExitTemperature ** 4 +
          1.822707e-17 * acceptedEconomizerExitTemperature ** 5) +
        params.alphaEconomizerCombustionMaterialBalance.theoreticalSO2Volume *
          (0.607026715343734 +
            3.08631797297832e-4 * acceptedEconomizerExitTemperature +
            -1.59369965554858e-7 * acceptedEconomizerExitTemperature ** 2 +
            1.63637023130679e-11 * acceptedEconomizerExitTemperature ** 3 +
            1.25572787709454e-14 * acceptedEconomizerExitTemperature ** 4 +
            -3.03012265579358e-18 * acceptedEconomizerExitTemperature ** 5) +
        params.alphaEconomizerCombustionMaterialBalance
          .theoreticalWaterVaporVolume *
          (1.498317949 +
            0.000102932 * acceptedEconomizerExitTemperature +
            0.000000244654 * acceptedEconomizerExitTemperature ** 2 +
            -0.000000000156126 * acceptedEconomizerExitTemperature ** 3 +
            4.36681e-14 * acceptedEconomizerExitTemperature ** 4 +
            -5.05709e-18 * acceptedEconomizerExitTemperature ** 5) +
        params.alphaEconomizerCombustionMaterialBalance
          .theoreticalNitrogenVolume *
          (1.29747332 +
            -0.000010563 * acceptedEconomizerExitTemperature +
            0.00000024181 * acceptedEconomizerExitTemperature ** 2 +
            -0.000000000183389 * acceptedEconomizerExitTemperature ** 3 +
            5.85924e-14 * acceptedEconomizerExitTemperature ** 4 +
            -7.03381e-18 * acceptedEconomizerExitTemperature ** 5) +
        params.alphaEconomizerCombustionMaterialBalance
          .theoreticalOxygenVolume *
          (1.306450711 +
            0.000150251 * acceptedEconomizerExitTemperature +
            0.000000172284 * acceptedEconomizerExitTemperature ** 2 +
            -0.000000000232114 * acceptedEconomizerExitTemperature ** 3 +
            1.01527e-13 * acceptedEconomizerExitTemperature ** 4 +
            -1.53025e-17 * acceptedEconomizerExitTemperature ** 5)) *
      acceptedEconomizerExitTemperature;
    const economizerHeatAbsorption =
      params.heatBalance.heatRetentionCoefficient *
      (params.convectivePackageHeatBalance.combustionProductEnthalpyExit -
        combustionProductEnthalpyExit +
        params.airLeakage.actualEconomizerAirLeakage *
          params.heatBalance.surroundingAirEnthalpy);

    const maxHeatedMediumTemperature =
      14.46082904 +
      391.6643525 *
        (params.boilerCharacteristic.excessPressureInBoiler + 0.1) ** 0.5 +
      -515.7573764 *
        (params.boilerCharacteristic.excessPressureInBoiler + 0.1) +
      467.8491656 *
        (params.boilerCharacteristic.excessPressureInBoiler + 0.1) ** 1.5 +
      -218.8244345 *
        (params.boilerCharacteristic.excessPressureInBoiler + 0.1) ** 2 +
      40.22947721 *
        (params.boilerCharacteristic.excessPressureInBoiler + 0.1) ** 2.5 -
      20;
    const averageHeatedMediumTemperature =
      (params.boilerCharacteristic.feedWaterTemperature +
        maxHeatedMediumTemperature) /
      2;
    const enthalpyIncrease =
      (economizerHeatAbsorption *
        params.heatBalance.calculatedHourlyFuelConsumption) /
      params.heatBalance.heatedHeatCarrierFlow;

    const heatedMediumExitTemperature =
      enthalpyIncrease / 4.2 + params.boilerCharacteristic.feedWaterTemperature;

    const averageHeatedMediumExitTemperature =
      (params.boilerCharacteristic.feedWaterTemperature +
        heatedMediumExitTemperature) /
      2;

    const logarithmicTemperatureDifference =
      ((params.convectivePackageHeatBalance.acceptedPackageExitTemperature -
        heatedMediumExitTemperature -
        (acceptedEconomizerExitTemperature -
          params.boilerCharacteristic.feedWaterTemperature)) *
        geometricAdjustmentFactor) /
      Math.log(
        (params.convectivePackageHeatBalance.acceptedPackageExitTemperature -
          heatedMediumExitTemperature) /
          (acceptedEconomizerExitTemperature -
            params.boilerCharacteristic.feedWaterTemperature),
      );

    const averageCombustionTemperature =
      (params.convectivePackageHeatBalance.acceptedPackageExitTemperature +
        acceptedEconomizerExitTemperature) /
      2;

    const averageCombustionVelocity =
      (params.heatBalance.calculatedHourlyFuelConsumption *
        params.alphaEconomizerAvgCombustionMaterialBalance
          .totalWetCombustionProductsVolume *
        (averageCombustionTemperature + 273.15)) /
      (3600 * params.economizerCharacteristic.channelCrossSectionArea * 273.15);

    const reynoldsCriterion =
      (averageCombustionVelocity *
        params.economizerCharacteristic.equivalentChannelDiameter) /
      (1.196865e-5 +
        7.93511e-8 * averageCombustionTemperature +
        9.50931e-11 * averageCombustionTemperature ** 2 +
        -1.8727e-14 * averageCombustionTemperature ** 3 +
        -2.98081e-18 * averageCombustionTemperature ** 4 +
        2.03358e-21 * averageCombustionTemperature ** 5);

    const prandtlCriterion =
      0.738992754 +
      -0.000431304 * averageCombustionTemperature +
      0.000000571399 * averageCombustionTemperature ** 2 +
      -0.000000000435355 * averageCombustionTemperature ** 3 +
      1.525e-13 * averageCombustionTemperature ** 4 +
      -1.98029e-17 * averageCombustionTemperature ** 5;
    const finningCoefficient =
      (2 *
        ((params.economizerCharacteristic.finSize * 0.001) ** 2 -
          0.785 *
            (params.economizerCharacteristic.outerCasingTubeDiameter * 0.001) **
              2 +
          2 *
            params.economizerCharacteristic.finSize *
            0.001 *
            params.economizerCharacteristic.finThickness *
            0.001)) /
        (3.14159 *
          params.economizerCharacteristic.outerCasingTubeDiameter *
          0.001 *
          params.economizerCharacteristic.finPitch *
          0.001) -
      params.economizerCharacteristic.finThickness /
        params.economizerCharacteristic.finPitch +
      1;

    const parameterPhi = Math.tanh(
      4 *
        (finningCoefficient / 7 +
          2 -
          params.economizerCharacteristic.relativeRowPitch),
    );

    const correctionCoefficientCs =
      (1.36 - parameterPhi) * (11 / (finningCoefficient + 8) - 0.14);

    const correctionCoefficientCz = 1;

    const convectiveHeatTransferCoefficient =
      ((0.113 *
        (0.081620792 +
          0.000316982 * averageCombustionTemperature +
          -0.000000020208 * averageCombustionTemperature ** 2 +
          7.29755e-12 * averageCombustionTemperature ** 3 +
          8.71812e-15 * averageCombustionTemperature ** 4 +
          -3.60461e-18 * averageCombustionTemperature ** 5)) /
        (params.economizerCharacteristic.outerCasingTubeDiameter * 0.001)) *
      reynoldsCriterion **
        (0.7 + 0.08 * parameterPhi + 0.005 * finningCoefficient) *
      prandtlCriterion ** 0.33 *
      correctionCoefficientCs *
      correctionCoefficientCz;

    const heatTransferCoefficient =
      heatEfficiencyCoefficient *
      heatUtilizationCoefficient *
      convectiveHeatTransferCoefficient;

    const heatTransferByEquation =
      (heatTransferCoefficient *
        params.economizerCharacteristic.totalHeatTransferSurfaceArea *
        logarithmicTemperatureDifference) /
      params.heatBalance.calculatedHourlyFuelConsumption;

    const calculatedEconomizerExitTemperature =
      (params.convectivePackageHeatBalance.combustionProductEnthalpyExit -
        heatTransferByEquation / params.heatBalance.heatRetentionCoefficient +
        params.airLeakage.actualEconomizerAirLeakage *
          params.heatBalance.surroundingAirEnthalpy) /
      (params.alphaEconomizerCombustionMaterialBalance.theoreticalCO2Volume *
        (1.604309582 +
          0.001133138 * acceptedEconomizerExitTemperature -
          0.000000860416 * acceptedEconomizerExitTemperature ** 2 +
          0.000000000468441 * acceptedEconomizerExitTemperature ** 3 -
          1.44713e-13 * acceptedEconomizerExitTemperature ** 4 +
          1.822707e-17 * acceptedEconomizerExitTemperature ** 5) +
        params.alphaEconomizerCombustionMaterialBalance.theoreticalSO2Volume *
          (0.607026715343734 +
            3.08631797297832e-4 * acceptedEconomizerExitTemperature -
            1.59369965554858e-7 * acceptedEconomizerExitTemperature ** 2 +
            1.63637023130679e-11 * acceptedEconomizerExitTemperature ** 3 +
            1.25572787709454e-14 * acceptedEconomizerExitTemperature ** 4 -
            3.03012265579358e-18 * acceptedEconomizerExitTemperature ** 5) +
        params.alphaEconomizerCombustionMaterialBalance
          .theoreticalWaterVaporVolume *
          (1.498317949 +
            0.000102932 * acceptedEconomizerExitTemperature +
            0.000000244654 * acceptedEconomizerExitTemperature ** 2 -
            0.000000000156126 * acceptedEconomizerExitTemperature ** 3 +
            4.36681e-14 * acceptedEconomizerExitTemperature ** 4 -
            5.05709e-18 * acceptedEconomizerExitTemperature ** 5) +
        params.alphaEconomizerCombustionMaterialBalance
          .theoreticalNitrogenVolume *
          (1.29747332 -
            0.000010563 * acceptedEconomizerExitTemperature +
            0.00000024181 * acceptedEconomizerExitTemperature ** 2 -
            0.000000000183389 * acceptedEconomizerExitTemperature ** 3 +
            5.85924e-14 * acceptedEconomizerExitTemperature ** 4 -
            7.03381e-18 * acceptedEconomizerExitTemperature ** 5) +
        params.alphaEconomizerCombustionMaterialBalance
          .theoreticalOxygenVolume *
          (1.306450711 +
            0.000150251 * acceptedEconomizerExitTemperature +
            0.000000172284 * acceptedEconomizerExitTemperature ** 2 -
            0.000000000232114 * acceptedEconomizerExitTemperature ** 3 +
            1.01527e-13 * acceptedEconomizerExitTemperature ** 4 -
            1.53025e-17 * acceptedEconomizerExitTemperature ** 5));

    const heatBalanceImbalance = Math.abs(
      ((economizerHeatAbsorption - heatTransferByEquation) * 100) /
        heatTransferByEquation,
    );

    const specificHeatTransferEconomizer =
      (params.heatBalance.calculatedHourlyFuelConsumption *
        economizerHeatAbsorption) /
      params.economizerCharacteristic.totalHeatTransferSurfaceArea;

    const economizerHeatBalance = new EconomizerHeatBalance({
      geometricAdjustmentFactor,
      heatEfficiencyCoefficient,
      heatUtilizationCoefficient,
      acceptedEconomizerExitTemperature,
      combustionProductEnthalpyExit,
      economizerHeatAbsorption,
      maxHeatedMediumTemperature,
      averageHeatedMediumTemperature,
      enthalpyIncrease,
      heatedMediumExitTemperature,
      averageHeatedMediumExitTemperature,
      logarithmicTemperatureDifference,
      averageCombustionTemperature,
      averageCombustionVelocity,
      reynoldsCriterion,
      prandtlCriterion,
      finningCoefficient,
      parameterPhi,
      correctionCoefficientCs,
      correctionCoefficientCz,
      convectiveHeatTransferCoefficient,
      heatTransferCoefficient,
      heatTransferByEquation,
      calculatedEconomizerExitTemperature,
      heatBalanceImbalance,
      specificHeatTransferEconomizer,
    });

    return economizerHeatBalance;
  }
}
