import { Module } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { SimulationController } from './simulation.controller';
import { EngineModule } from 'src/engine/engine.module';
import { StateModule } from 'src/state/state.module';
import { RuntimeModule } from 'src/runtime/runtime.module';
import { ObservationsModule } from 'src/observations/observations.module';

@Module({
  imports: [EngineModule, StateModule, RuntimeModule, ObservationsModule],
  providers: [SimulationService],
  controllers: [SimulationController],
})
export class SimulationModule {}
