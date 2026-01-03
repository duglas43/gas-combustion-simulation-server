export class Observation {
  efficiency: number;

  adiabaticCombustionTemperature: number;

  furnaceExitTemperature: number;

  firstConvectivePackageExitTemperature: number;

  secondConvectivePackageExitTemperature: number;

  economizerExitTemperature: number;

  flueGasTemperature: number;

  fuelConsumption: number;

  lossesWithFlueGasPercentage: number;

  lossesThroughWallsPercentage: number;

  totalLosses: number;

  furnaceImbalance: number;

  firstConvectivePackageImbalance: number;

  secondConvectivePackageImbalance: number;

  economizerImbalance: number;

  constructor(model: Partial<Observation>) {
    this.efficiency = model.efficiency;
    this.adiabaticCombustionTemperature = model.adiabaticCombustionTemperature;
    this.furnaceExitTemperature = model.furnaceExitTemperature;
    this.firstConvectivePackageExitTemperature =
      model.firstConvectivePackageExitTemperature;
    this.secondConvectivePackageExitTemperature =
      model.secondConvectivePackageExitTemperature;
    this.economizerExitTemperature = model.economizerExitTemperature;
    this.flueGasTemperature = model.flueGasTemperature;
    this.fuelConsumption = model.fuelConsumption;
    this.lossesWithFlueGasPercentage = model.lossesWithFlueGasPercentage;
    this.lossesThroughWallsPercentage = model.lossesThroughWallsPercentage;
    this.totalLosses = model.totalLosses;
    this.furnaceImbalance = model.furnaceImbalance;
    this.firstConvectivePackageImbalance =
      model.firstConvectivePackageImbalance;
    this.secondConvectivePackageImbalance =
      model.secondConvectivePackageImbalance;
    this.economizerImbalance = model.economizerImbalance;
  }
}
