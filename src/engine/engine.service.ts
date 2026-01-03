import { Injectable } from '@nestjs/common';
import PQueue from 'p-queue';
import { RuntimeService } from 'src/runtime/runtime.service';
@Injectable()
export class EngineService {
  private readonly STEP = 1000;
  private lastRealTs = Date.now();
  private simulatedDeltaAccumulator = 0;
  private running = false;

  public constructor(
    private readonly runtimeService: RuntimeService,
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
      this.tick();
      this.enqueueTick();
    });
  }

  private tick() {
    const runtime = this.runtimeService.getCurrent();
    if (!this.runtimeService.canTick()) return;

    const now = Date.now();
    const realDelta = now - this.lastRealTs;
    this.lastRealTs = now;

    const simulatedDelta = runtime.speedUpFactor * realDelta;
    this.simulatedDeltaAccumulator += simulatedDelta;

    while (this.simulatedDeltaAccumulator >= this.STEP) {
      this.simulateStep();
      this.simulatedDeltaAccumulator -= this.STEP;
    }
  }

  private simulateStep() {
    console.log('EngineService: simulate step');
    this.runtimeService.step(this.STEP);
  }
}
