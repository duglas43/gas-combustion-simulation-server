import { Module } from '@nestjs/common';
import { AirExcessCoefficientsService } from './air-excess-coefficients.service';

@Module({
  imports: [],
  providers: [AirExcessCoefficientsService],
  exports: [AirExcessCoefficientsService],
})
export class AirExcessCoefficientsModule {}
