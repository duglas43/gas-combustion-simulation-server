export class HeatBalance {
  heatLossDueToChemicalIncompleteCombustionPercentage: number;

  heatInputFromFuel: number;

  heatInputFromAir: number;

  availableHeatInputToBoiler: number;

  flueGasTemperatureSet: number;

  flueGasEnthalpy: number;

  surroundingAirEnthalpy: number;

  heatLossWithFlueGases: number;

  heatLossWithFlueGasesPercentage: number;

  heatLossDueToChemicalIncompleteCombustion: number;

  heatLossThroughOuterWallsPercentage: number;

  heatLossThroughOuterWalls: number;

  boilerEfficiencyGross: number;

  totalHeatLoss: number;

  blowdownWaterFlow: number;

  usefulHeatUtilized: number;

  calculatedHourlyFuelConsumption: number;

  heatedHeatCarrierFlow: number;

  heatRetentionCoefficient: number;

  constructor(model: HeatBalance) {
    this.heatLossDueToChemicalIncompleteCombustionPercentage =
      model.heatLossDueToChemicalIncompleteCombustionPercentage;
    this.heatInputFromFuel = model.heatInputFromFuel;
    this.heatInputFromAir = model.heatInputFromAir;
    this.availableHeatInputToBoiler = model.availableHeatInputToBoiler;
    this.flueGasTemperatureSet = model.flueGasTemperatureSet;
    this.flueGasEnthalpy = model.flueGasEnthalpy;
    this.surroundingAirEnthalpy = model.surroundingAirEnthalpy;
    this.heatLossWithFlueGases = model.heatLossWithFlueGases;
    this.heatLossWithFlueGasesPercentage =
      model.heatLossWithFlueGasesPercentage;
    this.heatLossDueToChemicalIncompleteCombustion =
      model.heatLossDueToChemicalIncompleteCombustion;
    this.heatLossThroughOuterWallsPercentage =
      model.heatLossThroughOuterWallsPercentage;
    this.heatLossThroughOuterWalls = model.heatLossThroughOuterWalls;
    this.boilerEfficiencyGross = model.boilerEfficiencyGross;
    this.totalHeatLoss = model.totalHeatLoss;
    this.blowdownWaterFlow = model.blowdownWaterFlow;
    this.usefulHeatUtilized = model.usefulHeatUtilized;
    this.calculatedHourlyFuelConsumption =
      model.calculatedHourlyFuelConsumption;
    this.heatedHeatCarrierFlow = model.heatedHeatCarrierFlow;
    this.heatRetentionCoefficient = model.heatRetentionCoefficient;
  }
}
