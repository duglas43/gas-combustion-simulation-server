import { Module } from '@nestjs/common';
import { CalculationsService } from './calculations.service';
import { CalculationsController } from './calculations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AirExcessCoefficient } from './entity/air-excess-coefficient.entity';
import { CombustionMaterialBalance } from './entity/combustion-material-balance.entity';
import { CombustionMaterialBalanceTemperature } from './entity/combustion-material-balance-temperature.entity';
import { ConvectivePackageHeatBalance } from './entity/convective-package-heat-balance.entity';
import { EconomizerHeatBalance } from './entity/economizer-heat-balance.entity';
import { FurnaceHeatBalance } from './entity/furnace-heat-balance.entity';
import { HeatBalance } from './entity/heat-balance.entity';
import { EconomizerCharacteristicsModule } from 'src/economizer-characteristics/economizer-characteristics.module';
import { BoilerCharacteristicsModule } from 'src/boiler-characteristics/boiler-characteristics.module';
import { FuelCompositionsModule } from 'src/fuel-compositions/fuel-compositions.module';
import { FurnaceCharacteristicsModule } from 'src/furnace-characteristics/furnace-characteristics.module';
import { ConvectivePackagesModule } from 'src/convective-packages/convective-packages.module';
import { AirLeakagesModule } from 'src/air-leakages/air-leakages.module';
import { TemperatureCharacteristicsModule } from 'src/temperature-characteristics/temparature-characteristics.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AirExcessCoefficient,
      CombustionMaterialBalance,
      CombustionMaterialBalanceTemperature,
      ConvectivePackageHeatBalance,
      EconomizerHeatBalance,
      FurnaceHeatBalance,
      HeatBalance,
    ]),
    EconomizerCharacteristicsModule,
    BoilerCharacteristicsModule,
    FuelCompositionsModule,
    FurnaceCharacteristicsModule,
    ConvectivePackagesModule,
    AirLeakagesModule,
    TemperatureCharacteristicsModule,
  ],
  controllers: [CalculationsController],
  providers: [CalculationsService],
})
export class CalculationsModule {}
