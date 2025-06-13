import { Module } from '@nestjs/common';
import { CalculationsService } from './calculations.service';
import { CalculationsController } from './calculations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AirExcessCoefficient } from './entity/air-excess-coefficient.entity';
import { AirLeakage } from './entity/air-leakage.entity';
import { CombustionMaterialBalance } from './entity/combustion-material-balance.entity';
import { CombustionMaterialBalanceTemperature } from './entity/combustion-material-balance-temperature.entity';
import { ConvectivePackage } from './entity/convective-package.entity';
import { ConvectivePackageHeatBalance } from './entity/convective-package-heat-balance.entity';
import { EconomizerHeatBalance } from './entity/economizer-heat-balance.entity';
import { FurnaceCharacteristic } from './entity/furnace-characteristic.entity';
import { FurnaceHeatBalance } from './entity/furnace-heat-balance.entity';
import { HeatBalance } from './entity/heat-balance.entity';
import { TemperatureCharacteristic } from './entity/temperature-characteristic.entity';
import { EconomizerCharacteristicsModule } from 'src/economizer-characteristics/economizer-characteristics.module';
import { BoilerCharacteristicsModule } from 'src/boiler-characteristics/boiler-characteristics.module';
import { FuelCompositionsModule } from 'src/fuel-compositions/fuel-compositions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AirExcessCoefficient,
      AirLeakage,
      CombustionMaterialBalance,
      CombustionMaterialBalanceTemperature,
      ConvectivePackage,
      ConvectivePackageHeatBalance,
      EconomizerHeatBalance,
      FurnaceCharacteristic,
      FurnaceHeatBalance,
      HeatBalance,
      TemperatureCharacteristic,
    ]),
    EconomizerCharacteristicsModule,
    BoilerCharacteristicsModule,
    FuelCompositionsModule,
  ],
  controllers: [CalculationsController],
  providers: [CalculationsService],
})
export class CalculationsModule {}
