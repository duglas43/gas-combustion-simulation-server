import { Module } from '@nestjs/common';
import { AirLeakagesService } from './air-leakages.service';

@Module({
  providers: [AirLeakagesService],
  exports: [AirLeakagesService],
})
export class AirLeakagesModule {}
