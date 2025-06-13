import { Injectable } from '@nestjs/common';
import { EconomizerCharacteristicRepository } from './repositories';

@Injectable()
export class EconomizerCharacteristicsService {
  constructor(
    private readonly economizerCharacteristicRepository: EconomizerCharacteristicRepository,
  ) {}

  public async calculate() {
    const economizerCharacteristic =
      this.economizerCharacteristicRepository.create({
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
        relativeTubePitchInRow: 1.974,
        relativeRowPitch: 1.974,
        totalEconomizerTubes: 112,
        numberOfColumns: 2,
        totalHeatTransferSurfaceArea: 502.9,
        channelCrossSectionArea: 1.26,
        equivalentChannelDiameter: 0.0304,
      });
    return economizerCharacteristic;
  }
}
