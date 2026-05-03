import { Injectable } from '@nestjs/common';
import PQueue from 'p-queue';
import { HeatBalanceSolverService } from 'src/phisics/heat-balance-solver/heat-balance-solver.service';
import { Observation } from 'src/observations/entities';
import { ObservationsService } from 'src/observations/observations.service';
import { RuntimeService } from 'src/runtime/runtime.service';
import { StateService } from 'src/state/state.service';
import { StateEvolverService } from 'src/state-evolver/state-evolver.service';
import { LawsService } from 'src/laws/laws.service';
import { State } from 'src/state/entities';
import { Laws } from 'src/laws/entities';
import { StateSnapshot } from 'src/state/snapshots/entities';

@Injectable()
export class EngineService {
  private readonly STEP = 1000;
  private readonly FORECAST_STEPS = 50;
  private readonly FORECAST_HISTORY_LIMIT = 20;
  private lastRealTs = Date.now();
  private simulatedDeltaAccumulator = 0;
  private running = false;

  public constructor(
    private readonly runtimeService: RuntimeService,
    private readonly stateService: StateService,
    private readonly heatBalanceSolverService: HeatBalanceSolverService,
    private readonly observationService: ObservationsService,
    private readonly stateEvolver: StateEvolverService,
    private readonly lawsService: LawsService,
    private readonly queue: PQueue,
  ) {}

  public start() {
    if (this.running) return;
    this.running = true;
    this.lastRealTs = Date.now();
    this.enqueueTick();
  }
  public stop() {
    this.running = false;
    this.queue.clear();
  }

  private enqueueTick() {
    if (!this.running) return;

    this.queue.add(async () => {
      await this.tick();
      this.enqueueTick();
    });
  }

  private async tick() {
    const runtime = this.runtimeService.getCurrent();
    if (!this.runtimeService.canTick()) return;

    const now = Date.now();
    const realDelta = now - this.lastRealTs;
    this.lastRealTs = now;

    const simulatedDelta = runtime.speedUpFactor * realDelta;
    this.simulatedDeltaAccumulator += simulatedDelta;

    while (this.simulatedDeltaAccumulator >= this.STEP) {
      await this.simulateStep();
      this.simulatedDeltaAccumulator -= this.STEP;
    }
  }

  private async simulateStep() {
    const runtime = this.runtimeService.getCurrent();
    const currentState = this.stateService.getCurrent();
    const currentLaws = this.lawsService.getCurrent();
    const lastObservation = await this.observationService.getLastObservation();
    const newObservation = this.heatBalanceSolverService.solveStep(
      lastObservation,
      currentState,
      {
        maxInternalIterations: 1000,
        threshold: 0.01,
      },
    );
    newObservation.time = new Date(lastObservation.time.getTime() + this.STEP);
    newObservation.timestamp = Number(lastObservation.timestamp) + this.STEP;
    const newState = this.stateEvolver.evolve({
      state: currentState,
      observation: newObservation,
      laws: currentLaws,
      currentTime: runtime.currentTime / 1000,
      dt: this.STEP,
    });
    this.stateService.replace(newState);
    await this.observationService.saveObservation(newObservation);
    await this.stateService.saveSnapshot({
      state: newState,
      laws: currentLaws,
      timestamp: Number(newObservation.timestamp),
      time: newObservation.time,
    });

    const { observations: forecastObservations, snapshots: forecastSnapshots } =
      await this.getForecast();
    this.observationService.saveForecastObservations(forecastObservations);
    this.stateService.saveForecastSnapshots(forecastSnapshots);

    this.runtimeService.step(this.STEP);
  }

  private async getForecast(): Promise<{
    observations: Observation[];
    snapshots: StateSnapshot[];
  }> {
    const currentLaws = this.lawsService.getCurrent();
    const recentSnapshots = await this.stateService.getRecentSnapshots(
      this.FORECAST_HISTORY_LIMIT,
    );
    const stateTrend = this.buildStateTrend(recentSnapshots, currentLaws);
    const lastObservation = await this.observationService.getLastObservation();
    const forecastSnapshots: StateSnapshot[] = [];
    const forecastObservations: Observation[] = [];
    let tempState = this.clone(this.stateService.getCurrent());
    let tempObservation = lastObservation;

    for (let i = 0; i < this.FORECAST_STEPS; i++) {
      const stateWithTrend = this.applyStateTrend(
        tempState,
        stateTrend,
        this.STEP / 1000,
      );
      const newTempObservation = this.heatBalanceSolverService.solveStep(
        tempObservation,
        stateWithTrend,
        {
          maxInternalIterations: 1000,
          threshold: 0.01,
        },
      );
      const nextTimestamp = Number(tempObservation.timestamp) + this.STEP;
      const nextTime = new Date(tempObservation.time.getTime() + this.STEP);
      tempState = this.stateEvolver.evolve({
        state: stateWithTrend,
        observation: newTempObservation,
        laws: currentLaws,
        currentTime: Number(tempObservation.timestamp) / 1000,
        dt: this.STEP,
      });
      tempObservation = {
        ...newTempObservation,
        time: nextTime,
        timestamp: nextTimestamp,
      };
      forecastObservations.push(tempObservation);
      forecastSnapshots.push({
        time: nextTime,
        timestamp: nextTimestamp,
        state: this.clone(tempState),
        laws: this.clone(currentLaws),
      });
    }

    return { observations: forecastObservations, snapshots: forecastSnapshots };
  }

  private buildStateTrend(
    snapshots: StateSnapshot[],
    laws: Laws,
  ): Record<string, number> {
    if (snapshots.length < 2) return {};

    const firstSnapshot = snapshots[0];
    const lastSnapshot = snapshots[snapshots.length - 1];
    const elapsedSeconds =
      (Number(lastSnapshot.timestamp) - Number(firstSnapshot.timestamp)) / 1000;
    if (elapsedSeconds <= 0) return {};

    const firstValues = this.flattenNumbers(firstSnapshot.state);
    const lastValues = this.flattenNumbers(lastSnapshot.state);
    const trend: Record<string, number> = {};

    for (const [path, lastValue] of Object.entries(lastValues)) {
      if (!this.canTrendPath(path, laws)) continue;

      const firstValue = firstValues[path];
      if (firstValue === undefined) continue;

      const rate = (lastValue - firstValue) / elapsedSeconds;
      if (rate !== 0 && Number.isFinite(rate)) {
        trend[path] = rate;
      }
    }

    return trend;
  }

  private canTrendPath(path: string, laws: Laws): boolean {
    const normalizedPath = this.normalizeArrayPath(path);
    const trendablePaths = new Set([
      'fuelComposition.methanePercentage',
      'fuelComposition.ethanePercentage',
      'fuelComposition.propanePercentage',
      'fuelComposition.nButanePercentage',
      'fuelComposition.isoButanePercentage',
      'fuelComposition.pentanePercentage',
      'fuelComposition.hydrogenPercentage',
      'fuelComposition.ethylenePercentage',
      'fuelComposition.propylenePercentage',
      'fuelComposition.butylenePercentage',
      'fuelComposition.acetylenePercentage',
      'fuelComposition.hydrogenSulfidePercentage',
      'fuelComposition.carbonMonoxidePercentage',
      'fuelComposition.carbonDioxidePercentage',
      'fuelComposition.nitrogenPercentage',
      'fuelComposition.oxygenPercentage',
      'boilerCharacteristics.loadPercentage',
      'boilerCharacteristics.blowdownPercentage',
      'boilerCharacteristics.airHumidityForCombustion',
      'boilerCharacteristics.gasHumidityForCombustion',
      'boilerCharacteristics.feedWaterTemperature',
      'boilerCharacteristics.roomAirTemperature',
      'boilerCharacteristics.gasInletTemperature',
      'boilerCharacteristics.excessAirCoefficient',
      'airLeakage.nominalFurnaceAirLeakage',
      'airLeakage.nominalFirstConvectiveAirLeakage',
      'airLeakage.nominalSecondConvectiveAirLeakage',
      'airLeakage.nominalEconomizerAirLeakage',
      'furnaceCharacteristics.screenContaminationFactor',
      'convectivePackagesParameters.*.wallBlacknessDegree',
    ]);

    if (!trendablePaths.has(normalizedPath)) return false;

    return !Object.keys(laws ?? {}).some((lawPath) =>
      this.pathMatchesLaw(path, lawPath),
    );
  }

  private applyStateTrend(
    state: State,
    trend: Record<string, number>,
    dtSeconds: number,
  ): State {
    const nextState = this.clone(state);

    for (const [path, rate] of Object.entries(trend)) {
      const currentValue = this.getPathValue(nextState, path);
      if (typeof currentValue !== 'number') continue;
      this.setPathValue(nextState, path, currentValue + rate * dtSeconds);
    }

    return nextState;
  }

  private flattenNumbers(value: unknown, path = ''): Record<string, number> {
    if (typeof value === 'number') return { [path]: value };
    if (value === null || value === undefined) return {};

    if (Array.isArray(value)) {
      return value.reduce(
        (acc, item, index) => ({
          ...acc,
          ...this.flattenNumbers(item, this.joinPath(path, String(index))),
        }),
        {},
      );
    }

    if (typeof value === 'object') {
      return Object.entries(value).reduce(
        (acc, [key, child]) => ({
          ...acc,
          ...this.flattenNumbers(child, this.joinPath(path, key)),
        }),
        {},
      );
    }

    return {};
  }

  private pathMatchesLaw(path: string, lawPath: string): boolean {
    const pathSegments = path.split('.');
    const lawSegments = lawPath.split('.');
    if (pathSegments.length !== lawSegments.length) return false;

    return lawSegments.every(
      (segment, index) => segment === '*' || segment === pathSegments[index],
    );
  }

  private normalizeArrayPath(path: string): string {
    return path
      .split('.')
      .map((segment) => (/^\d+$/.test(segment) ? '*' : segment))
      .join('.');
  }

  private getPathValue(target: unknown, path: string): unknown {
    return path
      .split('.')
      .reduce((current, segment) => current?.[segment], target);
  }

  private setPathValue(target: unknown, path: string, value: number): void {
    const segments = path.split('.');
    const lastSegment = segments.pop();
    const parent = segments.reduce(
      (current, segment) => current?.[segment],
      target,
    );

    if (parent && lastSegment) parent[lastSegment] = value;
  }

  private joinPath(parent: string, child: string): string {
    return parent ? `${parent}.${child}` : child;
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
  }
}
