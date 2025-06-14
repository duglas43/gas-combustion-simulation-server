import { Module } from '@nestjs/common';
import { ConvectivePackageHeatBalancesService } from './convective-package-heat-balances.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConvectivePackageHeatBalance } from './entities';
import { ConvectivePackageHeatBalanceRepository } from './repositories/convective-package-heat-balance.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ConvectivePackageHeatBalance])],
  providers: [
    ConvectivePackageHeatBalancesService,
    ConvectivePackageHeatBalanceRepository,
  ],
  exports: [
    ConvectivePackageHeatBalancesService,
    ConvectivePackageHeatBalanceRepository,
  ],
})
export class ConvectivePackageHeatBalancesModule {}
