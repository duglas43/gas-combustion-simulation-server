export class TemperatureCharacteristic {
  recirculationRate: number;

  combustionAirTemperature: number;

  gasMixtureHeatCapacity: number;

  boilerRoomAirHeatCapacity: number;

  combustionAirHeatCapacity: number;

  constructor(model: TemperatureCharacteristic) {
    this.recirculationRate = model.recirculationRate;
    this.combustionAirTemperature = model.combustionAirTemperature;
    this.gasMixtureHeatCapacity = model.gasMixtureHeatCapacity;
    this.boilerRoomAirHeatCapacity = model.boilerRoomAirHeatCapacity;
    this.combustionAirHeatCapacity = model.combustionAirHeatCapacity;
  }
}
