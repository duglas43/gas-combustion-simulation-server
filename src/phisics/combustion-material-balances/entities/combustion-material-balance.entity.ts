export class CombustionMaterialBalance {
  airExcessCoefficientName: string;

  actualWetAirConsumption: number;

  theoreticalCO2Volume: number;

  theoreticalSO2Volume: number;

  theoreticalWaterVaporVolume: number;

  theoreticalNitrogenVolume: number;

  theoreticalOxygenVolume: number;

  totalWetCombustionProductsVolume: number;

  specificVolumeFractionRO2: number;

  specificVolumeFractionWaterVapor: number;

  specificVolumeFractionTriatomicGases: number;

  partialPressureRO2: number;

  partialPressureWaterVapor: number;

  partialPressureTriatomicGases: number;

  recirculationRate: number;

  specificMassOfCombustionProducts: number;

  constructor(model: CombustionMaterialBalance) {
    this.airExcessCoefficientName = model.airExcessCoefficientName;
    this.actualWetAirConsumption = model.actualWetAirConsumption;
    this.theoreticalCO2Volume = model.theoreticalCO2Volume;
    this.theoreticalSO2Volume = model.theoreticalSO2Volume;
    this.theoreticalWaterVaporVolume = model.theoreticalWaterVaporVolume;
    this.theoreticalNitrogenVolume = model.theoreticalNitrogenVolume;
    this.theoreticalOxygenVolume = model.theoreticalOxygenVolume;
    this.totalWetCombustionProductsVolume =
      model.totalWetCombustionProductsVolume;
    this.specificVolumeFractionRO2 = model.specificVolumeFractionRO2;
    this.specificVolumeFractionWaterVapor =
      model.specificVolumeFractionWaterVapor;
    this.specificVolumeFractionTriatomicGases =
      model.specificVolumeFractionTriatomicGases;
    this.partialPressureRO2 = model.partialPressureRO2;
    this.partialPressureWaterVapor = model.partialPressureWaterVapor;
    this.partialPressureTriatomicGases = model.partialPressureTriatomicGases;
    this.recirculationRate = model.recirculationRate;
    this.specificMassOfCombustionProducts =
      model.specificMassOfCombustionProducts;
  }
}
