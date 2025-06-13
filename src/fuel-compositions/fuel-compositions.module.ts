import { Module } from '@nestjs/common';
import { FuelCompositionsService } from './fuel-compositions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelComposition } from './entities';
import { FuelCompositionRepository } from './repositories/fuel-composition.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FuelComposition])],
  providers: [FuelCompositionsService, FuelCompositionRepository],
  exports: [FuelCompositionsService, FuelCompositionRepository],
})
export class FuelCompositionsModule {}
