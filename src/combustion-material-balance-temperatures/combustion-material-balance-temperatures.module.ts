import { Module } from '@nestjs/common';
import { CombustionMaterialBalanceTemperaturesService } from './combustion-material-balance-temperatures.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CombustionMaterialBalanceTemperature } from './entities';
import { CombustionMaterialBalanceTemperatureRepository } from './repositories/combustion-material-balance-temperature.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CombustionMaterialBalanceTemperature])],
  providers: [
    CombustionMaterialBalanceTemperaturesService,
    CombustionMaterialBalanceTemperatureRepository,
  ],
  exports: [
    CombustionMaterialBalanceTemperaturesService,
    CombustionMaterialBalanceTemperatureRepository,
  ],
})
export class CombustionMaterialBalanceTemperaturesModule {}
