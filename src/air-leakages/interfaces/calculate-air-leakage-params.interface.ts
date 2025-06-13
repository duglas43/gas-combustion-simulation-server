import { BoilerCharacteristic } from 'src/boiler-characteristics/entities';

export interface CalculateAirLeakageParams {
  boilerCharacreristics: Pick<
    BoilerCharacteristic,
    'nominalSteamProduction' | 'actualSteamProduction'
  >;
}
