import { Injectable } from '@nestjs/common';
import { LAW_TYPES } from 'src/laws/enums';
import { Law } from 'src/laws/entities';
import { StateDelta, StateEvolver, StateEvolverContext } from '../types';

@Injectable()
export class LawsEvolver extends StateEvolver {
  public evolve(context: StateEvolverContext): StateDelta {
    const state = this.clone(context.state);
    const dtSeconds = context.dt / 1000;

    for (const [path, law] of Object.entries(context.laws ?? {})) {
      this.applyLaw(state, path, law, context.currentTime, dtSeconds);
    }

    return state;
  }

  private applyLaw(
    state: StateDelta,
    path: string,
    law: Law,
    currentTime: number,
    dt: number,
  ): void {
    this.applyLawBySegments(state, path.split('.'), law, currentTime, dt);
  }

  private calculateValue(
    law: Law,
    currentValue: number,
    currentTime: number,
    dt: number,
  ): number {
    const params = law.params ?? {};
    const startTime = params.startTime ?? 0;
    if (currentTime < startTime) return currentValue;

    const elapsed = currentTime - startTime;
    switch (law.type) {
      case LAW_TYPES.CONST:
        return params.value ?? currentValue;
      case LAW_TYPES.STEP:
        return params.value ?? params.target ?? currentValue;
      case LAW_TYPES.RAMP:
        return this.calculateRamp(currentValue, params.rate, params.target, dt);
      case LAW_TYPES.EXP:
        return this.calculateExp(currentValue, params.target, params.tau, dt);
      case LAW_TYPES.SIN:
        return (
          (params.value ?? currentValue) +
          (params.amplitude ?? 0) *
            Math.sin(2 * Math.PI * (params.frequency ?? 0) * elapsed)
        );
      case LAW_TYPES.NOISE:
        return (
          (params.value ?? currentValue) +
          (params.amplitude ?? 0) * (Math.random() * 2 - 1)
        );
      default:
        return currentValue;
    }
  }

  private calculateRamp(
    currentValue: number,
    rate: number,
    target: number,
    dt: number,
  ): number {
    if (rate === undefined) return currentValue;
    const nextValue = currentValue + rate * dt;
    if (target === undefined) return nextValue;

    if (rate >= 0) return Math.min(nextValue, target);
    return Math.max(nextValue, target);
  }

  private calculateExp(
    currentValue: number,
    target: number,
    tau: number,
    dt: number,
  ): number {
    if (target === undefined) return currentValue;
    if (!tau || tau <= 0) return target;

    return currentValue + (target - currentValue) * (1 - Math.exp(-dt / tau));
  }

  private applyLawBySegments(
    target: unknown,
    segments: string[],
    law: Law,
    currentTime: number,
    dt: number,
  ): void {
    if (!segments.length || target === null || target === undefined) return;

    const [segment, ...rest] = segments;
    if (segment === '*') {
      if (!Array.isArray(target)) return;
      for (const item of target) {
        this.applyLawBySegments(item, rest, law, currentTime, dt);
      }
      return;
    }

    if (!rest.length) {
      const currentValue = target[segment];
      if (typeof currentValue !== 'number') return;

      const value = this.calculateValue(law, currentValue, currentTime, dt);
      if (value === undefined || Number.isNaN(value)) return;

      target[segment] = value;
      return;
    }

    this.applyLawBySegments(target[segment], rest, law, currentTime, dt);
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
  }
}
