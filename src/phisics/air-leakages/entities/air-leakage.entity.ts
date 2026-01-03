export class AirLeakage {
  actualFurnaceAirLeakage: number;

  nominalFurnaceAirLeakage: number;

  actualFirstConvectiveAirLeakage: number;

  nominalFirstConvectiveAirLeakage: number;

  actualSecondConvectiveAirLeakage: number;

  nominalSecondConvectiveAirLeakage: number;

  actualEconomizerAirLeakage: number;

  nominalEconomizerAirLeakage: number;

  constructor(model: AirLeakage) {
    this.actualFurnaceAirLeakage = model.actualFurnaceAirLeakage;
    this.nominalFurnaceAirLeakage = model.nominalFurnaceAirLeakage;
    this.actualFirstConvectiveAirLeakage =
      model.actualFirstConvectiveAirLeakage;
    this.nominalFirstConvectiveAirLeakage =
      model.nominalFirstConvectiveAirLeakage;
    this.actualSecondConvectiveAirLeakage =
      model.actualSecondConvectiveAirLeakage;
    this.nominalSecondConvectiveAirLeakage =
      model.nominalSecondConvectiveAirLeakage;
    this.actualEconomizerAirLeakage = model.actualEconomizerAirLeakage;
    this.nominalEconomizerAirLeakage = model.nominalEconomizerAirLeakage;
  }
}
