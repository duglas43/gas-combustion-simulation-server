export class FurnaceCharacteristic {
  firstScreenArea: number;

  firstScreenAngleCoefficient: number;

  secondScreenArea: number;

  secondScreenAngleCoefficient: number;

  thirdScreenArea: number;

  thirdScreenAngleCoefficient: number;

  fourthScreenArea: number;

  fourthScreenAngleCoefficient: number;

  fifthScreenArea: number;

  fifthScreenAngleCoefficient: number;

  nonScreenedFurnaceArea: number;

  furnaceVolume: number;

  furnaceHeight: number;

  firstBurnerRowHeight: number;

  burnersInFirstRow: number;

  secondBurnerRowHeight: number;

  burnersInSecondRow: number;

  firstScreenRadiantHeatSurface: number;

  secondScreenRadiantHeatSurface: number;

  thirdScreenRadiantHeatSurface: number;

  fourthScreenRadiantHeatSurface: number;

  fifthScreenRadiantHeatSurface: number;

  totalRadiantHeatSurfaceArea: number;

  totalWallSurfaceArea: number;

  furnaceScreeningDegree: number;

  effectiveRadiatingLayerThickness: number;

  totalBurnersInBoiler: number;

  screenContaminationFactor: number;

  constructor(model: FurnaceCharacteristic) {
    this.firstScreenArea = model.firstScreenArea;
    this.firstScreenAngleCoefficient = model.firstScreenAngleCoefficient;
    this.secondScreenArea = model.secondScreenArea;
    this.secondScreenAngleCoefficient = model.secondScreenAngleCoefficient;
    this.thirdScreenArea = model.thirdScreenArea;
    this.thirdScreenAngleCoefficient = model.thirdScreenAngleCoefficient;
    this.fourthScreenArea = model.fourthScreenArea;
    this.fourthScreenAngleCoefficient = model.fourthScreenAngleCoefficient;
    this.fifthScreenArea = model.fifthScreenArea;
    this.fifthScreenAngleCoefficient = model.fifthScreenAngleCoefficient;
    this.nonScreenedFurnaceArea = model.nonScreenedFurnaceArea;
    this.furnaceVolume = model.furnaceVolume;
    this.furnaceHeight = model.furnaceHeight;
    this.firstBurnerRowHeight = model.firstBurnerRowHeight;
    this.burnersInFirstRow = model.burnersInFirstRow;
    this.secondBurnerRowHeight = model.secondBurnerRowHeight;
    this.burnersInSecondRow = model.burnersInSecondRow;
    this.firstScreenRadiantHeatSurface = model.firstScreenRadiantHeatSurface;
    this.secondScreenRadiantHeatSurface = model.secondScreenRadiantHeatSurface;
    this.thirdScreenRadiantHeatSurface = model.thirdScreenRadiantHeatSurface;
    this.fourthScreenRadiantHeatSurface = model.fourthScreenRadiantHeatSurface;
    this.fifthScreenRadiantHeatSurface = model.fifthScreenRadiantHeatSurface;
    this.totalRadiantHeatSurfaceArea = model.totalRadiantHeatSurfaceArea;
    this.totalWallSurfaceArea = model.totalWallSurfaceArea;
    this.furnaceScreeningDegree = model.furnaceScreeningDegree;
    this.effectiveRadiatingLayerThickness =
      model.effectiveRadiatingLayerThickness;
    this.totalBurnersInBoiler = model.totalBurnersInBoiler;
    this.screenContaminationFactor = model.screenContaminationFactor;
  }
}
