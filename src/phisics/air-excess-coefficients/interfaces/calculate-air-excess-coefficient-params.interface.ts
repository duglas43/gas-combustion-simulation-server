import { AirLeakage } from 'src/phisics/air-leakages/entities';
import { BoilerCharacteristic } from 'src/phisics/boiler-characteristics/entities';

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
