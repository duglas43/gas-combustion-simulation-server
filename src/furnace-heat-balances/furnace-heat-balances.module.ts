import { Module } from '@nestjs/common';
import { FurnaceHeatBalancesService } from './furnace-heat-balances.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FurnaceHeatBalance } from './entities';
import { FurnaceHeatBalanceRepository } from './repositories/furnace-heat-balance.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FurnaceHeatBalance])],
  providers: [FurnaceHeatBalancesService, FurnaceHeatBalanceRepository],
  exports: [FurnaceHeatBalancesService, FurnaceHeatBalanceRepository],
})
export class FurnaceHeatBalancesModule {}
