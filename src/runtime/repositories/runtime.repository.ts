import { Runtime } from '../entities';
import { RUNTIME_STATUSES } from '../enums';

export class RuntimeRepository {
  private runtime = new Runtime({
    status: RUNTIME_STATUSES.IDLE,
    currentTime: 0,
    speedUpFactor: 1,
  });

  public create(speedUpFactor: number) {
    this.runtime.status = RUNTIME_STATUSES.IDLE;
    this.runtime.currentTime = 0;
    this.runtime.speedUpFactor = speedUpFactor;
  }

  public update(runtime: Partial<Runtime>) {
    if (runtime.speedUpFactor !== undefined) {
      this.runtime.speedUpFactor = runtime.speedUpFactor;
    }
    if (runtime.currentTime !== undefined) {
      this.runtime.currentTime = runtime.currentTime;
    }
    if (runtime.status !== undefined) {
      this.runtime.status = runtime.status;
    }
  }

  public makeRunningIfTransitioning() {
    if (this.runtime.status === RUNTIME_STATUSES.TRANSITIONING) {
      this.runtime.status = RUNTIME_STATUSES.RUNNING;
    }
  }

  public getCurrent() {
    return this.runtime;
  }
}
