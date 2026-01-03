import { Module } from '@nestjs/common';
import { EconomizerHeatBalancesService } from './economizer-heat-balances.service';

@Module({
  providers: [EconomizerHeatBalancesService],
  exports: [EconomizerHeatBalancesService],
})
export class EconomizerHeatBalancesModule {}
