export class CombustionMaterialBalanceTemperature {
  lowerHeatingValue: number;

  higherHeatingValue: number;

  theoreticalDryAirConsumption: number;

  theoreticalWetAirConsumption: number;

  constructor(model: CombustionMaterialBalanceTemperature) {
    this.lowerHeatingValue = model.lowerHeatingValue;
    this.higherHeatingValue = model.higherHeatingValue;
    this.theoreticalDryAirConsumption = model.theoreticalDryAirConsumption;
    this.theoreticalWetAirConsumption = model.theoreticalWetAirConsumption;
  }
}
