export class EconomizerHeatBalance {
  geometricAdjustmentFactor: number;

  heatEfficiencyCoefficient: number;

  heatUtilizationCoefficient: number;

  acceptedEconomizerExitTemperature: number;

  combustionProductEnthalpyExit: number;

  economizerHeatAbsorption: number;

  maxHeatedMediumTemperature: number;

  averageHeatedMediumTemperature: number;

  enthalpyIncrease: number;

  heatedMediumExitTemperature: number;

  averageHeatedMediumExitTemperature: number;

  logarithmicTemperatureDifference: number;

  averageCombustionTemperature: number;

  averageCombustionVelocity: number;

  reynoldsCriterion: number;

  prandtlCriterion: number;

  finningCoefficient: number;

  parameterPhi: number;

  correctionCoefficientCs: number;

  correctionCoefficientCz: number;

  convectiveHeatTransferCoefficient: number;

  heatTransferCoefficient: number;

  heatTransferByEquation: number;

  calculatedEconomizerExitTemperature: number;

  heatBalanceImbalance: number;

  specificHeatTransferEconomizer: number;

  constructor(model: EconomizerHeatBalance) {
    this.geometricAdjustmentFactor = model.geometricAdjustmentFactor;
    this.heatEfficiencyCoefficient = model.heatEfficiencyCoefficient;
    this.heatUtilizationCoefficient = model.heatUtilizationCoefficient;
    this.acceptedEconomizerExitTemperature =
      model.acceptedEconomizerExitTemperature;
    this.combustionProductEnthalpyExit = model.combustionProductEnthalpyExit;
    this.economizerHeatAbsorption = model.economizerHeatAbsorption;
    this.maxHeatedMediumTemperature = model.maxHeatedMediumTemperature;
    this.averageHeatedMediumTemperature = model.averageHeatedMediumTemperature;
    this.enthalpyIncrease = model.enthalpyIncrease;
    this.heatedMediumExitTemperature = model.heatedMediumExitTemperature;
    this.averageHeatedMediumExitTemperature =
      model.averageHeatedMediumExitTemperature;
    this.logarithmicTemperatureDifference =
      model.logarithmicTemperatureDifference;
    this.averageCombustionTemperature = model.averageCombustionTemperature;
    this.averageCombustionVelocity = model.averageCombustionVelocity;
    this.reynoldsCriterion = model.reynoldsCriterion;
    this.prandtlCriterion = model.prandtlCriterion;
    this.finningCoefficient = model.finningCoefficient;
    this.parameterPhi = model.parameterPhi;
    this.correctionCoefficientCs = model.correctionCoefficientCs;
    this.correctionCoefficientCz = model.correctionCoefficientCz;
    this.convectiveHeatTransferCoefficient =
      model.convectiveHeatTransferCoefficient;
    this.heatTransferCoefficient = model.heatTransferCoefficient;
    this.heatTransferByEquation = model.heatTransferByEquation;
    this.calculatedEconomizerExitTemperature =
      model.calculatedEconomizerExitTemperature;
    this.heatBalanceImbalance = model.heatBalanceImbalance;
    this.specificHeatTransferEconomizer = model.specificHeatTransferEconomizer;
  }
}
