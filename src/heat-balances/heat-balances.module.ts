import { Module } from '@nestjs/common';
import { HeatBalancesService } from './heat-balances.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeatBalance } from './entities';
import { HeatBalanceRepository } from './repositories/heat-balance.repository';

@Module({
  imports: [TypeOrmModule.forFeature([HeatBalance])],
  providers: [HeatBalancesService, HeatBalanceRepository],
  exports: [HeatBalancesService, HeatBalanceRepository],
})
export class HeatBalancesModule {}
