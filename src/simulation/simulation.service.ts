import { Injectable } from '@nestjs/common';
import { CreateSimulationDto, UpdateSimulationDto } from './dtos';
import { EngineService } from 'src/engine/engine.service';
import { RuntimeService } from 'src/runtime/runtime.service';
import { StateService } from 'src/state/state.service';
import { ObservationsService } from 'src/observations/observations.service';

@Injectable()
export class SimulationService {
  constructor(
    private readonly engineService: EngineService,
    private readonly runtimeService: RuntimeService,
    private readonly stateService: StateService,
    private readonly observationService: ObservationsService,
  ) {}

  create(createSimulationDto: CreateSimulationDto): void {
    this.runtimeService.create(createSimulationDto.runtime);
    this.stateService.create(createSimulationDto.state);
  }

  update(updateSimulationDto: UpdateSimulationDto): void {
    this.runtimeService.update(updateSimulationDto.runtime);
    this.stateService.update(updateSimulationDto.state);
  }

  start(): void {
    this.runtimeService.start();
    this.engineService.start();
  }

  stop(): void {
    this.runtimeService.stop();
    this.engineService.stop();
  }

  pause(): void {
    this.runtimeService.pause();
    this.engineService.stop();
  }

  reset(): void {
    this.runtimeService.reset();
    this.stateService.reset();
    this.observationService.clearAll();
  }
}
