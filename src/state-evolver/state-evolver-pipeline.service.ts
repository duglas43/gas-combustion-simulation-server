import { Injectable } from '@nestjs/common';
import { StateDelta, StateEvolver, StateEvolverContext } from './types';
import { State } from 'src/state/entities';

@Injectable()
export class StateEvolverPipelineService {
  private readonly evolvers: StateEvolver[];

  constructor(evolvers: StateEvolver[]) {
    this.evolvers = evolvers;
  }

  public run(context: StateEvolverContext): State {
    let state = context.state;
    for (const evolver of this.evolvers) {
      const delta = evolver.evolve(context);
      state = this.merge(state, delta);
    }
    return state;
  }

  private merge(state: State, delta: StateDelta): State {
    return {
      ...state,
      ...delta,
    };
  }
}
