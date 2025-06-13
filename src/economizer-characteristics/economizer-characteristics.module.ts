import { Module } from '@nestjs/common';
import { EconomizerCharacteristicsService } from './economizer-characteristics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EconomizerCharacteristic } from './entities';
import { EconomizerCharacteristicRepository } from './repositories/economizer-characteristic.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EconomizerCharacteristic])],
  providers: [
    EconomizerCharacteristicsService,
    EconomizerCharacteristicRepository,
  ],
  exports: [
    EconomizerCharacteristicsService,
    EconomizerCharacteristicRepository,
  ],
})
export class EconomizerCharacteristicsModule {}
