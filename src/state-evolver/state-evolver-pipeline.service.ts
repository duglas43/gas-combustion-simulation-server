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
      const delta = evolver.evolve({ ...context, state });
      state = this.merge(state, delta);
    }
    return state;
  }

  private merge(state: State, delta: StateDelta): State {
    if (!delta) return state;
    return this.deepMerge(state, delta) as State;
  }

  private deepMerge<T>(target: T, source: Partial<T>): T {
    if (Array.isArray(source)) return source as T;
    if (!this.isPlainObject(target) || !this.isPlainObject(source)) {
      return source as T;
    }

    const result = { ...target } as Record<string, unknown>;
    for (const [key, value] of Object.entries(source)) {
      result[key] = this.deepMerge(result[key], value);
    }
    return result as T;
  }

  private isPlainObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }
}
