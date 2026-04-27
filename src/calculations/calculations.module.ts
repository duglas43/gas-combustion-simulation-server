import { Module } from '@nestjs/common';
import { CalculationsService } from './calculations.service';
import { CalculationsController } from './calculations.controller';
import { HeatBalanceSolverModule } from 'src/heat-balance-solver/heat-balance-solver.module';
import { StateModule } from 'src/state/state.module';

@Module({
  providers: [CalculationsService],
  controllers: [CalculationsController],
  imports: [HeatBalanceSolverModule, StateModule],
})
export class CalculationsModule {}
