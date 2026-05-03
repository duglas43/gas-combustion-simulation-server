import { Observation } from 'src/observations/entities';
import { State } from 'src/state/entities';

export interface StateEvolverContext {
  state: State;
  observation: Observation;
  dt: number;
}
