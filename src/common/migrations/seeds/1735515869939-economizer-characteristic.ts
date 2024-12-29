import { MigrationInterface, QueryRunner } from 'typeorm';
import { EconomizerCharacteristic } from 'src/calculations/entity/economizer-characteristic.entity';
import { plainToClass } from 'class-transformer';

export class EconomizerCharacteristic1735515869939
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.getRepository(EconomizerCharacteristic).save(
      plainToClass(EconomizerCharacteristic, {
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
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .getRepository(EconomizerCharacteristic)
      .delete({});
  }
}
