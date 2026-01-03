import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObservationRepository } from './repositories';
import { Observation } from './entities';
import { ObservationsService } from './observations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Observation])],
  providers: [ObservationRepository, ObservationsService],
  exports: [ObservationRepository, ObservationsService],
})
export class ObservationsModule {}
