import { Module } from '@nestjs/common';
import { RuntimeService } from './runtime.service';
import { RuntimeController } from './runtime.controller';
import { RuntimeRepository } from './repositories';

@Module({
  controllers: [RuntimeController],
  providers: [RuntimeService, RuntimeRepository],
  exports: [RuntimeService, RuntimeRepository],
})
export class RuntimeModule {}
