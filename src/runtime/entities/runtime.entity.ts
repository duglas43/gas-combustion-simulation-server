import { RUNTIME_STATUSES } from '../enums';

export class Runtime {
  status: RUNTIME_STATUSES;
  currentTime: number;
  speedUpFactor: number;

  public constructor(model: Partial<Runtime>) {
    this.status = model.status;
    this.currentTime = model.currentTime;
    this.speedUpFactor = model.speedUpFactor;
  }
}
