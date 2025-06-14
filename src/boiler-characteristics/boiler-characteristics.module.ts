import { Module } from '@nestjs/common';
import { BoilerCharacteristicsService } from './boiler-characteristics.service';

@Module({
  providers: [BoilerCharacteristicsService],
  exports: [BoilerCharacteristicsService],
})
export class BoilerCharacteristicsModule {}
