import { Module } from '@nestjs/common';
import { CombustionMaterialBalancesService } from './combustion-material-balances.service';

@Module({
  providers: [CombustionMaterialBalancesService],
  exports: [CombustionMaterialBalancesService],
})
export class CombustionMaterialBalancesModule {}
