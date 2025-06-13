import { Module } from '@nestjs/common';
import { AirExcessCoefficientsService } from './air-excess-coefficients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirExcessCoefficient } from './entities';
import { AirExcessCoefficientRepository } from './repositories/air-excess-coefficient.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AirExcessCoefficient])],
  providers: [AirExcessCoefficientsService, AirExcessCoefficientRepository],
  exports: [AirExcessCoefficientsService, AirExcessCoefficientRepository],
})
export class AirExcessCoefficientsModule {}
