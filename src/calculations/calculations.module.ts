import { Module } from '@nestjs/common';
import { CalculationsService } from './calculations.service';
import { CalculationsController } from './calculations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConvectivePackageHeatBalance } from './entity/convective-package-heat-balance.entity';
import { EconomizerHeatBalance } from './entity/economizer-heat-balance.entity';
import { EconomizerCharacteristicsModule } from 'src/economizer-characteristics/economizer-characteristics.module';
import { BoilerCharacteristicsModule } from 'src/boiler-characteristics/boiler-characteristics.module';
import { FuelCompositionsModule } from 'src/fuel-compositions/fuel-compositions.module';
import { FurnaceCharacteristicsModule } from 'src/furnace-characteristics/furnace-characteristics.module';
import { ConvectivePackagesModule } from 'src/convective-packages/convective-packages.module';
import { AirLeakagesModule } from 'src/air-leakages/air-leakages.module';
import { TemperatureCharacteristicsModule } from 'src/temperature-characteristics/temparature-characteristics.module';
import { CombustionMaterialBalanceTemperaturesModule } from 'src/combustion-material-balance-temperatures/combustion-material-balance-temperatures.module';
import { AirExcessCoefficientsModule } from 'src/air-excess-coefficients/air-excess-coefficients.module';
import { CombustionMaterialBalancesModule } from 'src/combustion-material-balances/combustion-material-balances.module';
import { HeatBalancesModule } from 'src/heat-balances/heat-balances.module';
import { FurnaceHeatBalancesModule } from 'src/furnace-heat-balances/furnace-heat-balances.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConvectivePackageHeatBalance,
      EconomizerHeatBalance,
    ]),
    EconomizerCharacteristicsModule,
    BoilerCharacteristicsModule,
    FuelCompositionsModule,
    FurnaceCharacteristicsModule,
    ConvectivePackagesModule,
    AirLeakagesModule,
    TemperatureCharacteristicsModule,
    CombustionMaterialBalanceTemperaturesModule,
    AirExcessCoefficientsModule,
    CombustionMaterialBalancesModule,
    HeatBalancesModule,
    FurnaceHeatBalancesModule,
  ],
  controllers: [CalculationsController],
  providers: [CalculationsService],
})
export class CalculationsModule {}
