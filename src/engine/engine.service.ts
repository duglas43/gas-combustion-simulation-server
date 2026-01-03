import { Injectable } from '@nestjs/common';
import PQueue from 'p-queue';
import { HeatBalanceSolverService } from 'src/heat-balance-solver/heat-balance-solver.service';
import { ObservationsService } from 'src/observations/observations.service';
import { RuntimeService } from 'src/runtime/runtime.service';
import { StateService } from 'src/state/state.service';
@Injectable()
export class EngineService {
  private readonly STEP = 1000;
  private lastRealTs = Date.now();
  private simulatedDeltaAccumulator = 0;
  private running = false;

  public constructor(
    private readonly runtimeService: RuntimeService,
    private readonly stateService: StateService,
    private readonly heatBalanceSolverService: HeatBalanceSolverService,
    private readonly observationService: ObservationsService,
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
    const currentState = this.stateService.getCurrent();
    const lastObservation = await this.observationService.getLastObservation();
    const newObservation = this.heatBalanceSolverService.solveStep(
      lastObservation,
      currentState,
      {
        maxInternalIterations: lastObservation.timestamp === 0 ? 300 : 2, // more iterations for the first step to stabilize
        threshold: 0.1,
      },
    );
    newObservation.time = new Date(lastObservation.time.getTime() + this.STEP);
    newObservation.timestamp = Number(lastObservation.timestamp) + 1000;
    await this.observationService.saveObservation(newObservation);
    this.runtimeService.step(this.STEP);
  }
}
