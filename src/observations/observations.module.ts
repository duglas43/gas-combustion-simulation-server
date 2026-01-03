import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObservationRepository } from './repositories';
import { Observation } from './entities';
import { ObservationsService } from './observations.service';
import { ObservationsController } from './observations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Observation])],
  controllers: [ObservationsController],
  providers: [ObservationRepository, ObservationsService],
  exports: [ObservationRepository, ObservationsService],
})
export class ObservationsModule {}
