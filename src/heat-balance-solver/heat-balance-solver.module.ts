import { Module } from '@nestjs/common';
import { HeatBalanceSolverService } from './heat-balance-solver.service';

import { AirLeakagesModule } from 'src/phisics/air-leakages/air-leakages.module';
import { TemperatureCharacteristicsModule } from 'src/phisics/temperature-characteristics/temparature-characteristics.module';
import { CombustionMaterialBalanceTemperaturesModule } from 'src/phisics/combustion-material-balance-temperatures/combustion-material-balance-temperatures.module';
import { AirExcessCoefficientsModule } from 'src/phisics/air-excess-coefficients/air-excess-coefficients.module';
import { CombustionMaterialBalancesModule } from 'src/phisics/combustion-material-balances/combustion-material-balances.module';
import { HeatBalancesModule } from 'src/phisics/heat-balances/heat-balances.module';
import { FurnaceHeatBalancesModule } from 'src/phisics/furnace-heat-balances/furnace-heat-balances.module';
import { ConvectivePackageHeatBalancesModule } from 'src/phisics/convective-package-heat-balances/convective-package-heat-balances.module';
import { EconomizerHeatBalancesModule } from 'src/phisics/economizer-heat-balances/economizer-heat-balances.module';

@Module({
  imports: [
    AirLeakagesModule,
    TemperatureCharacteristicsModule,
    CombustionMaterialBalanceTemperaturesModule,
    AirExcessCoefficientsModule,
    CombustionMaterialBalancesModule,
    HeatBalancesModule,
    FurnaceHeatBalancesModule,
    ConvectivePackageHeatBalancesModule,
    EconomizerHeatBalancesModule,
  ],
  providers: [HeatBalanceSolverService],
})
export class HeatBalanceSolverModule {}
