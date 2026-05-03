import { Injectable } from '@nestjs/common';
import { StateDelta, StateEvolver, StateEvolverContext } from '../types';

@Injectable()
export class StateNormalizationEvolver extends StateEvolver {
  public evolve(context: StateEvolverContext): StateDelta {
    const { boilerCharacteristics, airLeakage } = context.state;
    const actualSteamProduction =
      (boilerCharacteristics.nominalSteamProduction *
        boilerCharacteristics.loadPercentage) /
      100;
    const steamProductionRatio =
      boilerCharacteristics.nominalSteamProduction / actualSteamProduction;

    return {
      boilerCharacteristics: {
        actualSteamProduction,
      },
      airLeakage: {
        ...airLeakage,
        actualFurnaceAirLeakage:
          airLeakage.nominalFurnaceAirLeakage * steamProductionRatio,
        actualFirstConvectiveAirLeakage:
          airLeakage.nominalFirstConvectiveAirLeakage *
          steamProductionRatio ** 0.5,
        actualSecondConvectiveAirLeakage:
          airLeakage.nominalSecondConvectiveAirLeakage *
          steamProductionRatio ** 0.5,
        actualEconomizerAirLeakage:
          airLeakage.nominalEconomizerAirLeakage * steamProductionRatio ** 0.5,
      },
    } as StateDelta;
  }
}
