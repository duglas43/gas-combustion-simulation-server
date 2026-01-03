export class EconomizerCharacteristic {
  outerCasingTubeDiameter: number;

  finThickness: number;

  finPitch: number;

  finSize: number;

  tubePitchInRow: number;

  rowPitch: number;

  tubesPerRow: number;

  numberOfRows: number;

  averageTubeLength: number;

  heatTransferSurfaceAreaPerTube: number;

  finHeight: number;

  relativeTubePitchInRow: number;

  relativeRowPitch: number;

  totalEconomizerTubes: number;

  numberOfColumns: number;

  totalHeatTransferSurfaceArea: number;

  channelCrossSectionArea: number;

  equivalentChannelDiameter: number;

  constructor(model: EconomizerCharacteristic) {
    this.outerCasingTubeDiameter = model.outerCasingTubeDiameter;
    this.finThickness = model.finThickness;
    this.finPitch = model.finPitch;
    this.finSize = model.finSize;
    this.tubePitchInRow = model.tubePitchInRow;
    this.rowPitch = model.rowPitch;
    this.tubesPerRow = model.tubesPerRow;
    this.numberOfRows = model.numberOfRows;
    this.averageTubeLength = model.averageTubeLength;
    this.heatTransferSurfaceAreaPerTube = model.heatTransferSurfaceAreaPerTube;
    this.finHeight = model.finHeight;
    this.relativeTubePitchInRow = model.relativeTubePitchInRow;
    this.relativeRowPitch = model.relativeRowPitch;
    this.totalEconomizerTubes = model.totalEconomizerTubes;
    this.numberOfColumns = model.numberOfColumns;
    this.totalHeatTransferSurfaceArea = model.totalHeatTransferSurfaceArea;
    this.channelCrossSectionArea = model.channelCrossSectionArea;
    this.equivalentChannelDiameter = model.equivalentChannelDiameter;
  }
}
