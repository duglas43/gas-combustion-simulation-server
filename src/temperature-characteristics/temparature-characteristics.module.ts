import { Module } from '@nestjs/common';
import { TemperatureCharacteristicsService } from './temparature-characteristics.service';

@Module({
  providers: [TemperatureCharacteristicsService],
  exports: [TemperatureCharacteristicsService],
})
export class TemperatureCharacteristicsModule {}
