import { Module } from '@nestjs/common';
import { FurnaceHeatBalancesService } from './furnace-heat-balances.service';

@Module({
  providers: [FurnaceHeatBalancesService],
  exports: [FurnaceHeatBalancesService],
})
export class FurnaceHeatBalancesModule {}
