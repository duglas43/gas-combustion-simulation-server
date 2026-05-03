import { Module } from '@nestjs/common';
import { LawsController } from './laws.controller';
import { LawsService } from './laws.service';
import { LawsRepository } from './repositories';

@Module({
  controllers: [LawsController],
  providers: [LawsService, LawsRepository],
  exports: [LawsService, LawsRepository],
})
export class LawsModule {}
