import { Module } from '@nestjs/common';
import { HeatBalancesService } from './heat-balances.service';

@Module({
  providers: [HeatBalancesService],
  exports: [HeatBalancesService],
})
export class HeatBalancesModule {}
