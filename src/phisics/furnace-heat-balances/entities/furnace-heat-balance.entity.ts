export class FurnaceHeatBalance {
  blackBodyRadiationCoefficient: number;

  screenPollutionCoefficient: number;

  parameterM0: number;

  luminousFlameFillingCoefficient: number;

  acceptedFurnaceExitTemperature: number;

  combustionProductEnthalpyExit: number;

  combustionAirEnthalpy: number;

  airFractionFromAirPreheater: number;

  heatInputToFurnaceFromAir: number;

  usefulHeatReleaseInFurnace: number;

  acceptedAdiabaticCombustionTemperature: number;

  calculatedAdiabaticCombustionTemperature: number;

  imbalancePercentage: number;

  averageHeatCapacityProductsInFurnace: number;

  averageThermalEfficiencyCoefficient: number;

  boltzmannCriterion: number;

  maxTemperatureZoneHeight: number;

  relativeMaxTemperatureZonePosition: number;

  furnaceGasDilutionCoefficient: number;

  calculatedParameterM: number;

  rayAttenuationCoefficientThreeAtomGases: number;

  carbonToHydrogenMassRatio: number;

  sootRayAttenuationCoefficient: number;

  furnaceMediumAbsorptionCoefficient: number;

  bugerCriterion: number;

  effectiveBugerCriterion: number;

  calculatedFurnaceExitTemperature: number;

  calculatedImbalance: number;

  heatAbsorbedByRadiativeScreens: number;

  specificHeatLoadRadiativeScreens: number;

  specificHeatTensionFurnaceVolume: number;

  enthalpyIncrementHeatedHeatCarrier: number;

  constructor(model: FurnaceHeatBalance) {
    this.blackBodyRadiationCoefficient = model.blackBodyRadiationCoefficient;
    this.screenPollutionCoefficient = model.screenPollutionCoefficient;
    this.parameterM0 = model.parameterM0;
    this.luminousFlameFillingCoefficient =
      model.luminousFlameFillingCoefficient;
    this.acceptedFurnaceExitTemperature = model.acceptedFurnaceExitTemperature;
    this.combustionProductEnthalpyExit = model.combustionProductEnthalpyExit;
    this.combustionAirEnthalpy = model.combustionAirEnthalpy;
    this.airFractionFromAirPreheater = model.airFractionFromAirPreheater;
    this.heatInputToFurnaceFromAir = model.heatInputToFurnaceFromAir;
    this.usefulHeatReleaseInFurnace = model.usefulHeatReleaseInFurnace;
    this.acceptedAdiabaticCombustionTemperature =
      model.acceptedAdiabaticCombustionTemperature;
    this.calculatedAdiabaticCombustionTemperature =
      model.calculatedAdiabaticCombustionTemperature;
    this.imbalancePercentage = model.imbalancePercentage;
    this.averageHeatCapacityProductsInFurnace =
      model.averageHeatCapacityProductsInFurnace;
    this.averageThermalEfficiencyCoefficient =
      model.averageThermalEfficiencyCoefficient;
    this.boltzmannCriterion = model.boltzmannCriterion;
    this.maxTemperatureZoneHeight = model.maxTemperatureZoneHeight;
    this.relativeMaxTemperatureZonePosition =
      model.relativeMaxTemperatureZonePosition;
    this.furnaceGasDilutionCoefficient = model.furnaceGasDilutionCoefficient;
    this.calculatedParameterM = model.calculatedParameterM;
    this.rayAttenuationCoefficientThreeAtomGases =
      model.rayAttenuationCoefficientThreeAtomGases;
    this.carbonToHydrogenMassRatio = model.carbonToHydrogenMassRatio;
    this.sootRayAttenuationCoefficient = model.sootRayAttenuationCoefficient;
    this.furnaceMediumAbsorptionCoefficient =
      model.furnaceMediumAbsorptionCoefficient;
    this.bugerCriterion = model.bugerCriterion;
    this.effectiveBugerCriterion = model.effectiveBugerCriterion;
    this.calculatedFurnaceExitTemperature =
      model.calculatedFurnaceExitTemperature;
    this.calculatedImbalance = model.calculatedImbalance;
    this.heatAbsorbedByRadiativeScreens = model.heatAbsorbedByRadiativeScreens;
    this.specificHeatLoadRadiativeScreens =
      model.specificHeatLoadRadiativeScreens;
    this.specificHeatTensionFurnaceVolume =
      model.specificHeatTensionFurnaceVolume;
    this.enthalpyIncrementHeatedHeatCarrier =
      model.enthalpyIncrementHeatedHeatCarrier;
  }
}
