import { StateDelta } from './state-delta.interface';
import { StateEvolverContext } from './state-evolver-context.interface';

export abstract class StateEvolver {
  abstract evolve(context: StateEvolverContext): StateDelta;
}
