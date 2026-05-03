import { Injectable } from '@nestjs/common';
import { StateEvolverPipelineService } from './state-evolver-pipeline.service';
import { State } from 'src/state/entities';
import { StateEvolverContext } from './types';

@Injectable()
export class StateEvolverService {
  public constructor(
    private readonly stateEvolverPipelineService: StateEvolverPipelineService,
  ) {}

  public evolve(context: StateEvolverContext): State {
    return this.stateEvolverPipelineService.run(context);
  }
}
