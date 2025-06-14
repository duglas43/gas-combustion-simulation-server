import { Module } from '@nestjs/common';
import { CombustionMaterialBalanceTemperaturesService } from './combustion-material-balance-temperatures.service';

@Module({
  providers: [CombustionMaterialBalanceTemperaturesService],
  exports: [CombustionMaterialBalanceTemperaturesService],
})
export class CombustionMaterialBalanceTemperaturesModule {}
