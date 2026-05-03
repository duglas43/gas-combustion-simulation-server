import { Module } from '@nestjs/common';
import { StateService } from './state.service';
import { EconomizerCharacteristicsModule } from 'src/phisics/economizer-characteristics/economizer-characteristics.module';
import { BoilerCharacteristicsModule } from 'src/phisics/boiler-characteristics/boiler-characteristics.module';
import { FuelCompositionsModule } from 'src/phisics/fuel-compositions/fuel-compositions.module';
import { FurnaceCharacteristicsModule } from 'src/phisics/furnace-characteristics/furnace-characteristics.module';
import { ConvectivePackagesModule } from 'src/phisics/convective-packages/convective-packages.module';
import { StateController } from './state.controller';
import { StateRepository } from './repositories';
import { ResourcesModule } from 'src/phisics/resources/resources.module';
import { AirLeakagesModule } from 'src/phisics/air-leakages/air-leakages.module';

@Module({
  imports: [
    EconomizerCharacteristicsModule,
    BoilerCharacteristicsModule,
    FuelCompositionsModule,
    FurnaceCharacteristicsModule,
    ConvectivePackagesModule,
    ResourcesModule,
    AirLeakagesModule,
  ],
  controllers: [StateController],
  providers: [StateService, StateRepository],
  exports: [StateService, StateRepository],
})
export class StateModule {}
