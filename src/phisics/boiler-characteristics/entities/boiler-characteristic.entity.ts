export class BoilerCharacteristic {
  nominalSteamProduction: number;

  actualSteamProduction: number;

  loadPercentage: number;

  blowdownPercentage: number;

  excessPressureInBoiler: number;

  airHumidityForCombustion: number;

  gasHumidityForCombustion: number;

  feedWaterTemperature: number;

  roomAirTemperature: number;

  gasInletTemperature: number;

  excessAirCoefficient: number;

  flueGasAbsolutePressure: number;

  constructor(model: BoilerCharacteristic) {
    this.nominalSteamProduction = model.nominalSteamProduction;
    this.actualSteamProduction = model.actualSteamProduction;
    this.loadPercentage = model.loadPercentage;
    this.blowdownPercentage = model.blowdownPercentage;
    this.excessPressureInBoiler = model.excessPressureInBoiler;
    this.airHumidityForCombustion = model.airHumidityForCombustion;
    this.gasHumidityForCombustion = model.gasHumidityForCombustion;
    this.feedWaterTemperature = model.feedWaterTemperature;
    this.roomAirTemperature = model.roomAirTemperature;
    this.gasInletTemperature = model.gasInletTemperature;
    this.excessAirCoefficient = model.excessAirCoefficient;
    this.flueGasAbsolutePressure = model.flueGasAbsolutePressure;
  }
}
