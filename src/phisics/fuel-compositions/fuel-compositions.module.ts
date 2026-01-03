import { Module } from '@nestjs/common';
import { FuelCompositionsService } from './fuel-compositions.service';

@Module({
  providers: [FuelCompositionsService],
  exports: [FuelCompositionsService],
})
export class FuelCompositionsModule {}
