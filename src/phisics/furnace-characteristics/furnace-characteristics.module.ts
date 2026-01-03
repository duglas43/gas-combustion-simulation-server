import { Module } from '@nestjs/common';
import { FurnaceCharacteristicsService } from './furnace-characteristics.service';

@Module({
  providers: [FurnaceCharacteristicsService],
  exports: [FurnaceCharacteristicsService],
})
export class FurnaceCharacteristicsModule {}
