import { Module } from '@nestjs/common';
import { EconomizerCharacteristicsService } from './economizer-characteristics.service';

@Module({
  providers: [EconomizerCharacteristicsService],
  exports: [EconomizerCharacteristicsService],
})
export class EconomizerCharacteristicsModule {}
