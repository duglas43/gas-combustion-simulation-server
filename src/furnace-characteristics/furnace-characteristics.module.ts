import { Module } from '@nestjs/common';
import { FurnaceCharacteristicsService } from './furnace-characteristics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FurnaceCharacteristic } from './entities';
import { FurnaceCharacteristicRepository } from './repositories/furnace-characteristic.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FurnaceCharacteristic])],
  providers: [FurnaceCharacteristicsService, FurnaceCharacteristicRepository],
  exports: [FurnaceCharacteristicsService, FurnaceCharacteristicRepository],
})
export class FurnaceCharacteristicsModule {}
