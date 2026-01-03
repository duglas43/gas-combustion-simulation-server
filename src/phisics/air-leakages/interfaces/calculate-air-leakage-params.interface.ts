import { BoilerCharacteristic } from 'src/phisics/boiler-characteristics/entities';

export interface CalculateAirLeakageParams {
  boilerCharacreristics: Pick<
    BoilerCharacteristic,
    'nominalSteamProduction' | 'actualSteamProduction'
  >;
}
