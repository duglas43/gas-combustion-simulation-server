import { AirLeakage } from 'src/air-leakages/entities';
import { BoilerCharacteristic } from 'src/boiler-characteristics/entities';

export interface CalculateAirExcessCoefficientParams {
  airLeakage: Pick<
    AirLeakage,
    | 'actualFurnaceAirLeakage'
    | 'actualFirstConvectiveAirLeakage'
    | 'actualSecondConvectiveAirLeakage'
    | 'actualEconomizerAirLeakage'
  >;
  boilerCharacteristic: Pick<BoilerCharacteristic, 'excessAirCoefficient'>;
}
