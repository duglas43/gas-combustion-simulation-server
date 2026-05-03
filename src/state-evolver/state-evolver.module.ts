import { Module } from '@nestjs/common';
import { StateEvolverService } from './state-evolver.service';
import { StateEvolverPipelineService } from './state-evolver-pipeline.service';
import {
  FuelEvolver,
  LawsEvolver,
  StateNormalizationEvolver,
} from './evolvers';

@Module({
  providers: [
    StateEvolverService,
    LawsEvolver,
    StateNormalizationEvolver,
    FuelEvolver,
    {
      provide: StateEvolverPipelineService,
      useFactory: (
        lawsEvolver: LawsEvolver,
        stateNormalizationEvolver: StateNormalizationEvolver,
        fuelEvolver: FuelEvolver,
      ) => {
        const pipeline = new StateEvolverPipelineService([
          lawsEvolver,
          stateNormalizationEvolver,
          fuelEvolver,
        ]);
        return pipeline;
      },
      inject: [LawsEvolver, StateNormalizationEvolver, FuelEvolver],
    },
  ],
  exports: [StateEvolverService],
})
export class StateEvolverModule {}
