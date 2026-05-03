import { Injectable } from '@nestjs/common';
import { CreateSimulationDto, UpdateSimulationDto } from './dtos';
import { EngineService } from 'src/engine/engine.service';
import { RuntimeService } from 'src/runtime/runtime.service';
import { StateService } from 'src/state/state.service';
import { ObservationsService } from 'src/observations/observations.service';
import { LawsService } from 'src/laws/laws.service';

@Injectable()
export class SimulationService {
  constructor(
    private readonly engineService: EngineService,
    private readonly runtimeService: RuntimeService,
    private readonly stateService: StateService,
    private readonly observationService: ObservationsService,
    private readonly lawsService: LawsService,
  ) {}

  async create(createSimulationDto: CreateSimulationDto): Promise<void> {
    this.runtimeService.create(createSimulationDto.runtime);
    const state = this.stateService.create(createSimulationDto.state);
    this.lawsService.create(createSimulationDto.laws);
    await this.stateService.saveSnapshot({
      state,
      laws: this.lawsService.getCurrent(),
      timestamp: 0,
      time: new Date(),
    });
  }

  async update(updateSimulationDto: UpdateSimulationDto): Promise<void> {
    this.runtimeService.update(updateSimulationDto.runtime);
    this.lawsService.update(updateSimulationDto.laws);
    const state = this.stateService.update(updateSimulationDto.state);
    const runtime = this.runtimeService.getCurrent();
    await this.stateService.saveSnapshot({
      state,
      laws: this.lawsService.getCurrent(),
      timestamp: runtime.currentTime,
      time: new Date(),
    });
  }

  start(): void {
    this.runtimeService.start();
    this.engineService.start();
  }

  stop(): void {
    this.runtimeService.stop();
    this.engineService.stop();
  }

  async reset(): Promise<void> {
    this.runtimeService.reset();
    this.stateService.reset();
    this.lawsService.reset();
    await this.observationService.clearAll();
    await this.stateService.clearSnapshots();
  }
}
