import { Module } from '@nestjs/common';
import { CombustionMaterialBalancesService } from './combustion-material-balances.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CombustionMaterialBalance } from './entities';
import { CombustionMaterialBalanceRepository } from './repositories/combustion-material-balance.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CombustionMaterialBalance])],
  providers: [
    CombustionMaterialBalancesService,
    CombustionMaterialBalanceRepository,
  ],
  exports: [
    CombustionMaterialBalancesService,
    CombustionMaterialBalanceRepository,
  ],
})
export class CombustionMaterialBalancesModule {}
