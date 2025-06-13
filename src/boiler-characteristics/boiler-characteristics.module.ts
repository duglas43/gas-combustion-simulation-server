import { Module } from '@nestjs/common';
import { BoilerCharacteristicsService } from './boiler-characteristics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoilerCharacteristic } from './entities';
import { BoilerCharacteristicRepository } from './repositories/boiler-characteristic.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BoilerCharacteristic])],
  providers: [BoilerCharacteristicsService, BoilerCharacteristicRepository],
  exports: [BoilerCharacteristicsService, BoilerCharacteristicRepository],
})
export class BoilerCharacteristicsModule {}
