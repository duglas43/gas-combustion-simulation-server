import { Module } from '@nestjs/common';
import { StateEvolverService } from './state-evolver.service';
import { StateEvolverPipelineService } from './state-evolver-pipeline.service';
import { FuelEvolver } from './evolvers';

@Module({
  providers: [
    StateEvolverService,
    FuelEvolver,
    {
      provide: StateEvolverPipelineService,
      useFactory: (fuelEvolver: FuelEvolver) => {
        const pipeline = new StateEvolverPipelineService([fuelEvolver]);
        return pipeline;
      },
      inject: [FuelEvolver],
    },
  ],
  exports: [StateEvolverService],
})
export class StateEvolverModule {}
