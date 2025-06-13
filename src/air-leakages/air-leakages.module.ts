import { Module } from '@nestjs/common';
import { AirLeakagesService } from './air-leakages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirLeakage } from './entities';
import { AirLeakageRepository } from './repositories/air-leakage.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AirLeakage])],
  providers: [AirLeakagesService, AirLeakageRepository],
  exports: [AirLeakagesService, AirLeakageRepository],
})
export class AirLeakagesModule {}
