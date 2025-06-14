import { Module } from '@nestjs/common';
import { ConvectivePackageHeatBalancesService } from './convective-package-heat-balances.service';

@Module({
  providers: [ConvectivePackageHeatBalancesService],
  exports: [ConvectivePackageHeatBalancesService],
})
export class ConvectivePackageHeatBalancesModule {}
