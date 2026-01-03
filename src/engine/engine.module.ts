import { Module } from '@nestjs/common';
import { EngineService } from './engine.service';
import PQueue from 'p-queue';
import { RuntimeModule } from 'src/runtime/runtime.module';
@Module({
  imports: [RuntimeModule],
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
