import { Module } from '@nestjs/common';
import { EngineService } from './engine.service';
import PQueue from 'p-queue';
import { RuntimeModule } from 'src/runtime/runtime.module';
import { StateModule } from 'src/state/state.module';
import { HeatBalanceSolverModule } from 'src/heat-balance-solver/heat-balance-solver.module';
import { ObservationsModule } from 'src/observations/observations.module';
@Module({
  imports: [
    RuntimeModule,
    StateModule,
    HeatBalanceSolverModule,
    ObservationsModule,
  ],
  providers: [
    EngineService,
    {
      provide: PQueue,
      useFactory: (): PQueue =>
        new PQueue({ concurrency: 1, intervalCap: 1, interval: 50 }),
    },
  ],
  exports: [EngineService],
})
export class EngineModule {}
