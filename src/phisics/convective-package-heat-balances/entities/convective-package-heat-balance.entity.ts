export class ConvectivePackageHeatBalance {
  convectivePackageId: number;

  averageHeatAbsorptionCoefficient: number;

  sumAngularCoefficients: number;

  furnaceExitWindowArea: number;

  geometricAdjustmentFactor: number;

  screenWallBlacknessDegree: number;

  heatEfficiencyCoefficient: number;

  heatUtilizationCoefficient: number;

  acceptedPackageExitTemperature: number;

  combustionProductEnthalpyExit: number;

  heatBalanceAbsorption: number;

  radiativeHeatLoad: number;

  heatReceivedByRadiation: number;

  enthalpyIncrease: number;

  heatedMediumTemperature: number;

  logarithmicTemperatureDifference: number;

  averageCombustionTemperature: number;

  averageCombustionVelocity: number;

  reynoldsCriterion: number;

  prandtlCriterion: number;

  correctionCoefficientCs: number;

  correctionCoefficientCz: number;

  convectiveHeatTransferCoefficient: number;

  threeAtomGasRayAttenuationCoefficient: number;

  radiativeLayerOpticalThickness: number;

  effectiveBlacknessDegree: number;

  averageWallTemperature: number;

  radiativeHeatTransferCoefficient: number;

  heatTransferCoefficient: number;

  heatTransferByEquation: number;

  calculatedPackageExitTemperature: number;

  heatBalanceImbalance: number;

  specificHeatTransferred: number;

  constructor(model: ConvectivePackageHeatBalance) {
    this.convectivePackageId = model.convectivePackageId;
    this.averageHeatAbsorptionCoefficient =
      model.averageHeatAbsorptionCoefficient;
    this.sumAngularCoefficients = model.sumAngularCoefficients;
    this.furnaceExitWindowArea = model.furnaceExitWindowArea;
    this.geometricAdjustmentFactor = model.geometricAdjustmentFactor;
    this.screenWallBlacknessDegree = model.screenWallBlacknessDegree;
    this.heatEfficiencyCoefficient = model.heatEfficiencyCoefficient;
    this.heatUtilizationCoefficient = model.heatUtilizationCoefficient;
    this.acceptedPackageExitTemperature = model.acceptedPackageExitTemperature;
    this.combustionProductEnthalpyExit = model.combustionProductEnthalpyExit;
    this.heatBalanceAbsorption = model.heatBalanceAbsorption;
    this.radiativeHeatLoad = model.radiativeHeatLoad;
    this.heatReceivedByRadiation = model.heatReceivedByRadiation;
    this.enthalpyIncrease = model.enthalpyIncrease;
    this.heatedMediumTemperature = model.heatedMediumTemperature;
    this.logarithmicTemperatureDifference =
      model.logarithmicTemperatureDifference;
    this.averageCombustionTemperature = model.averageCombustionTemperature;
    this.averageCombustionVelocity = model.averageCombustionVelocity;
    this.reynoldsCriterion = model.reynoldsCriterion;
    this.prandtlCriterion = model.prandtlCriterion;
    this.correctionCoefficientCs = model.correctionCoefficientCs;
    this.correctionCoefficientCz = model.correctionCoefficientCz;
    this.convectiveHeatTransferCoefficient =
      model.convectiveHeatTransferCoefficient;
    this.threeAtomGasRayAttenuationCoefficient =
      model.threeAtomGasRayAttenuationCoefficient;
    this.radiativeLayerOpticalThickness = model.radiativeLayerOpticalThickness;
    this.effectiveBlacknessDegree = model.effectiveBlacknessDegree;
    this.averageWallTemperature = model.averageWallTemperature;
    this.radiativeHeatTransferCoefficient =
      model.radiativeHeatTransferCoefficient;
    this.heatTransferCoefficient = model.heatTransferCoefficient;
    this.heatTransferByEquation = model.heatTransferByEquation;
    this.calculatedPackageExitTemperature =
      model.calculatedPackageExitTemperature;
    this.heatBalanceImbalance = model.heatBalanceImbalance;
    this.specificHeatTransferred = model.specificHeatTransferred;
  }
}
