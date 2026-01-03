import { Module } from '@nestjs/common';
import { RuntimeService } from './runtime.service';
import { RuntimeController } from './runtime.controller';

@Module({
  controllers: [RuntimeController],
  providers: [RuntimeService],
  exports: [RuntimeService],
})
export class RuntimeModule {}
