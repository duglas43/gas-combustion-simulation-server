import { Injectable } from '@nestjs/common';
import { RUNTIME_STATUSES } from './enums';
import { CreateRuntimeDto, RuntimeDto, UpdateRuntimeDto } from './dtos';
import { RuntimeRepository } from './repositories';

@Injectable()
export class RuntimeService {
  public constructor(private readonly runtimeRepository: RuntimeRepository) {}

  public create(createRuntimeDto: CreateRuntimeDto) {
    this.runtimeRepository.create(createRuntimeDto.speedUpFactor);
  }

  public reset() {
    this.runtimeRepository.update({
      status: RUNTIME_STATUSES.IDLE,
      currentTime: 0,
      speedUpFactor: 1,
    });
  }

  public update(updateRuntimeDto: UpdateRuntimeDto) {
    this.runtimeRepository.update({
      speedUpFactor: updateRuntimeDto.speedUpFactor,
    });
    setTimeout(() => {
      this.runtimeRepository.makeRunningIfTransitioning();
    }, 1000);
  }
  public step(deltaTimeMs: number = 1000) {
    this.runtimeRepository.update({
      currentTime:
        this.runtimeRepository.getCurrent().currentTime + deltaTimeMs,
    });
  }
  public start() {
    this.runtimeRepository.update({
      status: RUNTIME_STATUSES.RUNNING,
    });
  }
  public pause() {
    this.runtimeRepository.update({
      status: RUNTIME_STATUSES.PAUSED,
    });
  }
  public stop() {
    this.runtimeRepository.update({
      status: RUNTIME_STATUSES.COMPLETED,
    });
  }

  public getCurrent() {
    const currentRuntime = this.runtimeRepository.getCurrent();
    return currentRuntime;
  }

  public getCurrentDto(): RuntimeDto {
    const currentRuntime = this.runtimeRepository.getCurrent();
    return new RuntimeDto(currentRuntime);
  }

  public canTick() {
    const currentStatus = this.runtimeRepository.getCurrent().status;
    return (
      currentStatus === RUNTIME_STATUSES.RUNNING ||
      currentStatus === RUNTIME_STATUSES.TRANSITIONING
    );
  }
}
