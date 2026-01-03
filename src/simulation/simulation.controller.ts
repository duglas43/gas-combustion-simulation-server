import { Controller, Patch, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateSimulationDto, UpdateSimulationDto } from './dtos';
import { SimulationService } from './simulation.service';

@ApiTags('simulation')
@Controller('simulation')
export class SimulationController {
  constructor(private readonly simulationService: SimulationService) {}

  @Post()
  create(@Body() createSimulationDto: CreateSimulationDto): void {
    this.simulationService.create(createSimulationDto);
  }

  @Patch()
  update(@Body() updateSimulationDto: UpdateSimulationDto): void {
    this.simulationService.update(updateSimulationDto);
  }

  @Post('start')
  start(): void {
    this.simulationService.start();
  }

  @Post('stop')
  stop(): void {
    this.simulationService.stop();
  }

  @Post('pause')
  pause(): void {
    this.simulationService.pause();
  }
}
