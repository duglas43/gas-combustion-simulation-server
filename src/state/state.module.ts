import { Module } from '@nestjs/common';
import { StateService } from './state.service';
import { EconomizerCharacteristicsModule } from 'src/phisics/economizer-characteristics/economizer-characteristics.module';
import { BoilerCharacteristicsModule } from 'src/phisics/boiler-characteristics/boiler-characteristics.module';
import { FuelCompositionsModule } from 'src/phisics/fuel-compositions/fuel-compositions.module';
import { FurnaceCharacteristicsModule } from 'src/phisics/furnace-characteristics/furnace-characteristics.module';
import { ConvectivePackagesModule } from 'src/phisics/convective-packages/convective-packages.module';
import { StateController } from './state.controller';

@Module({
  imports: [
    EconomizerCharacteristicsModule,
    BoilerCharacteristicsModule,
    FuelCompositionsModule,
    FurnaceCharacteristicsModule,
    ConvectivePackagesModule,
  ],
  controllers: [StateController],
  providers: [StateService],
  exports: [StateService],
})
export class StateModule {}
