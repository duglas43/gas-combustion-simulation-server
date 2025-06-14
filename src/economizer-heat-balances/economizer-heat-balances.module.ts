import { Module } from '@nestjs/common';
import { EconomizerHeatBalancesService } from './economizer-heat-balances.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EconomizerHeatBalance } from './entities';
import { EconomizerHeatBalanceRepository } from './repositories/economizer-heat-balance.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EconomizerHeatBalance])],
  providers: [EconomizerHeatBalancesService, EconomizerHeatBalanceRepository],
  exports: [EconomizerHeatBalancesService, EconomizerHeatBalanceRepository],
})
export class EconomizerHeatBalancesModule {}
