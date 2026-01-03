import { Injectable } from '@nestjs/common';
import { EconomizerCharacteristic } from './entities';

@Injectable()
export class EconomizerCharacteristicsService {
  public calculate() {
    const economizerCharacteristic = new EconomizerCharacteristic({
      outerCasingTubeDiameter: 76,
      finThickness: 5,
      finPitch: 25,
      finSize: 146,
      tubePitchInRow: 150,
      rowPitch: 150,
      tubesPerRow: 7,
      numberOfRows: 16,
      averageTubeLength: 3,
      heatTransferSurfaceAreaPerTube: 4.49,
      finHeight: 35,
      relativeTubePitchInRow: 1.973684211,
      relativeRowPitch: 1.973684211,
      totalEconomizerTubes: 112,
      numberOfColumns: 2,
      totalHeatTransferSurfaceArea: 502.88,
      channelCrossSectionArea: 1.26,
      equivalentChannelDiameter: 0.030424494,
    });
    return economizerCharacteristic;
  }
}
