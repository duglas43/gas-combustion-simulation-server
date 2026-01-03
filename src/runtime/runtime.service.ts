import { Injectable } from '@nestjs/common';
import { Runtime } from './entities';
import { RUNTIME_STATUSES } from './enums';
import { CreateRuntimeDto, RuntimeDto, UpdateRuntimeDto } from './dtos';

@Injectable()
export class RuntimeService {
  private runtime: Runtime;
  public constructor() {
    this.runtime = new Runtime({
      status: RUNTIME_STATUSES.IDLE,
      currentTime: 0,
      speedUpFactor: 1,
    });
  }

  public create(createRuntimeDto: CreateRuntimeDto) {
    this.runtime = new Runtime({
      status: RUNTIME_STATUSES.IDLE,
      currentTime: 0,
      speedUpFactor: createRuntimeDto.speedUpFactor,
    });
  }

  public reset() {
    this.runtime.status = RUNTIME_STATUSES.IDLE;
    this.runtime.currentTime = 0;
  }

  public update(updateRuntimeDto: UpdateRuntimeDto) {
    if (updateRuntimeDto.speedUpFactor !== undefined) {
      this.runtime.speedUpFactor = updateRuntimeDto.speedUpFactor;
    }
    this.runtime.status = RUNTIME_STATUSES.TRANSITIONING;
    setTimeout(() => {
      if (this.runtime.status === RUNTIME_STATUSES.TRANSITIONING) {
        this.runtime.status = RUNTIME_STATUSES.RUNNING;
      }
    }, 3000);
  }
  public step(deltaTimeMs: number = 1000) {
    this.runtime.currentTime += deltaTimeMs;
  }
  public start() {
    this.runtime.status = RUNTIME_STATUSES.RUNNING;
  }
  public pause() {
    this.runtime.status = RUNTIME_STATUSES.PAUSED;
  }
  public stop() {
    this.runtime.status = RUNTIME_STATUSES.COMPLETED;
  }

  public getCurrent() {
    return this.runtime;
  }

  public getCurrentDto(): RuntimeDto {
    return new RuntimeDto(this.runtime);
  }

  public canTick() {
    return this.runtime.status === RUNTIME_STATUSES.RUNNING;
  }
}
