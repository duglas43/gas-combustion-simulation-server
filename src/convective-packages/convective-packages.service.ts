import { Injectable } from '@nestjs/common';
import { CalculateConvectivePackageParams } from './interfaces';
import { ConvectivePackage } from './entities';

@Injectable()
export class ConvectivePackagesService {
  public calculate(params: CalculateConvectivePackageParams) {
    const convectivePackages: ConvectivePackage[] = [];
    for (const convectivePackage of params.createConvectivePackageDtos) {
      const relativeTubePitchInRow =
        convectivePackage.tubePitchInRow / convectivePackage.outerTubeDiameter;
      const relativeRowPitch =
        convectivePackage.rowPitch / convectivePackage.outerTubeDiameter;
      const effectiveRadiatingLayerThickness =
        0.9 *
        convectivePackage.outerTubeDiameter *
        0.001 *
        ((4 * relativeTubePitchInRow * relativeRowPitch) / Math.PI - 1);
      const convectivePackageHeatSurfaceArea =
        Math.PI *
        convectivePackage.outerTubeDiameter *
        0.001 *
        convectivePackage.averageTubeLength *
        convectivePackage.numberOfRows *
        convectivePackage.tubesPerRow;
      const totalNumberOfTubes =
        convectivePackage.tubesPerRow * convectivePackage.numberOfRows;
      const channelCrossSectionArea =
        convectivePackage.minCrossSectionDimension *
          convectivePackage.maxCrossSectionDimension -
        convectivePackage.outerTubeDiameter *
          0.001 *
          convectivePackage.averageTubeLength *
          convectivePackage.tubesPerRow;
      const equivalentChannelDiameter =
        (4 * channelCrossSectionArea) /
        ((convectivePackage.minCrossSectionDimension -
          convectivePackage.outerTubeDiameter *
            0.001 *
            convectivePackage.tubesPerRow) *
          2 +
          2.6 * (convectivePackage.tubesPerRow * 2 + 2));

      const convectivePackageEntity = new ConvectivePackage({
        ...convectivePackage,
        packageNumber: convectivePackage.id,
        relativeTubePitchInRow,
        relativeRowPitch,
        effectiveRadiatingLayerThickness,
        convectivePackageHeatSurfaceArea,
        totalNumberOfTubes,
        channelCrossSectionArea,
        equivalentChannelDiameter,
      });
      convectivePackages.push(convectivePackageEntity);
    }
    return convectivePackages;
  }
}
