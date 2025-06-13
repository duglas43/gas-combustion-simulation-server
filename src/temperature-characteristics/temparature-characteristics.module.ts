import { Module } from '@nestjs/common';
import { TemperatureCharacteristicsService } from './temparature-characteristics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemperatureCharacteristic } from './entities';
import { TemperatureCharacteristicRepository } from './repositories/temparature-characteristic.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TemperatureCharacteristic])],
  providers: [
    TemperatureCharacteristicsService,
    TemperatureCharacteristicRepository,
  ],
  exports: [
    TemperatureCharacteristicsService,
    TemperatureCharacteristicRepository,
  ],
})
export class TemperatureCharacteristicsModule {}
