import { Observation } from 'src/observations/entities';
import { State } from 'src/state/entities';
import { Laws } from 'src/laws/entities';

export interface StateEvolverContext {
  state: State;
  observation: Observation;
  laws: Laws;
  currentTime: number;
  dt: number;
}
