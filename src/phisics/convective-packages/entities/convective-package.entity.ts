export class ConvectivePackage {
  packageNumber: number;

  outerTubeDiameter: number;

  innerTubeDiameter: number;

  tubePitchInRow: number;

  rowPitch: number;

  tubesPerRow: number;

  numberOfRows: number;

  minCrossSectionDimension: number;

  maxCrossSectionDimension: number;

  averageTubeLength: number;

  relativeTubePitchInRow: number;

  relativeRowPitch: number;

  effectiveRadiatingLayerThickness: number;

  convectivePackageHeatSurfaceArea: number;

  totalNumberOfTubes: number;

  channelCrossSectionArea: number;

  equivalentChannelDiameter: number;

  wallBlacknessDegree: number;

  constructor(model: ConvectivePackage) {
    this.packageNumber = model.packageNumber;
    this.outerTubeDiameter = model.outerTubeDiameter;
    this.innerTubeDiameter = model.innerTubeDiameter;
    this.tubePitchInRow = model.tubePitchInRow;
    this.rowPitch = model.rowPitch;
    this.tubesPerRow = model.tubesPerRow;
    this.numberOfRows = model.numberOfRows;
    this.minCrossSectionDimension = model.minCrossSectionDimension;
    this.maxCrossSectionDimension = model.maxCrossSectionDimension;
    this.averageTubeLength = model.averageTubeLength;
    this.relativeTubePitchInRow = model.relativeTubePitchInRow;
    this.relativeRowPitch = model.relativeRowPitch;
    this.effectiveRadiatingLayerThickness =
      model.effectiveRadiatingLayerThickness;
    this.convectivePackageHeatSurfaceArea =
      model.convectivePackageHeatSurfaceArea;
    this.totalNumberOfTubes = model.totalNumberOfTubes;
    this.channelCrossSectionArea = model.channelCrossSectionArea;
    this.equivalentChannelDiameter = model.equivalentChannelDiameter;
    this.wallBlacknessDegree = model.wallBlacknessDegree;
  }
}
