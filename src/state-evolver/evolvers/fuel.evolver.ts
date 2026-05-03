import { Injectable } from '@nestjs/common';
import { StateDelta, StateEvolver, StateEvolverContext } from '../types';

@Injectable()
export class FuelEvolver extends StateEvolver {
  public evolve(context: StateEvolverContext): StateDelta {
    const currentFuelRemaining = context.state.resource.fuelRemaining;
    const fuelConsumptionRate = context.observation.fuelConsumption / 3600000;
    const fuelConsumed = fuelConsumptionRate * context.dt;
    return {
      resource: {
        fuelRemaining: currentFuelRemaining - fuelConsumed,
      },
    };
  }
}
