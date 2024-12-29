import { Module } from '@nestjs/common';
import { CalculationsService } from './calculations.service';
import { CalculationsController } from './calculations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AirExcessCoefficient } from './entity/air-excess-coefficient.entity';
import { AirLeakage } from './entity/air-leakage.entity';
import { BoilerCharacteristic } from './entity/boiler-characteristic.entity';
import { CombustionMaterialBalance } from './entity/combustion-material-balance.entity';
import { CombustionMaterialBalanceTemperature } from './entity/combustion-material-balance-temperature.entity';
import { ConvectivePackage } from './entity/convective-package.entity';
import { ConvectivePackageHeatBalance } from './entity/convective-package-heat-balance.entity';
import { EconomizerCharacteristic } from './entity/economizer-characteristic.entity';
import { EconomizerHeatBalance } from './entity/economizer-heat-balance.entity';
import { FuelComposition } from './entity/fuel-composition.entity';
import { FurnaceCharacteristic } from './entity/furnace-characteristic.entity';
import { FurnaceHeatBalance } from './entity/furnace-heat-balance.entity';
import { HeatBalance } from './entity/heat-balance.entity';
import { TemperatureCharacteristic } from './entity/temperature-characteristic.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AirExcessCoefficient,
      AirLeakage,
      BoilerCharacteristic,
      CombustionMaterialBalance,
      CombustionMaterialBalanceTemperature,
      ConvectivePackage,
      ConvectivePackageHeatBalance,
      EconomizerCharacteristic,
      EconomizerHeatBalance,
      FuelComposition,
      FurnaceCharacteristic,
      FurnaceHeatBalance,
      HeatBalance,
      TemperatureCharacteristic,
    ]),
  ],
  controllers: [CalculationsController],
  providers: [CalculationsService],
})
export class CalculationsModule {}
