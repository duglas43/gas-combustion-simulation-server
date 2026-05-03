import { BoilerCharacteristic } from 'src/phisics/boiler-characteristics/entities';
import { AirLeakage } from '../entities';

export interface CalculateAirLeakageParams {
  boilerCharacreristics: Pick<
    BoilerCharacteristic,
    'nominalSteamProduction' | 'actualSteamProduction'
  >;
  airLeakage: Pick<
    AirLeakage,
    | 'nominalFurnaceAirLeakage'
    | 'nominalFirstConvectiveAirLeakage'
    | 'nominalSecondConvectiveAirLeakage'
    | 'nominalEconomizerAirLeakage'
  >;
}
