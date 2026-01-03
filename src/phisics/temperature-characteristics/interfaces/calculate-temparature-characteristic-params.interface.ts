import { BoilerCharacteristic } from 'src/phisics/boiler-characteristics/entities';
import { FuelComposition } from 'src/phisics/fuel-compositions/entities';

export interface CalculateTemperatureCharacteristicParams {
  fuelComposition: FuelComposition;
  boilerCharacteristics: Pick<BoilerCharacteristic, 'roomAirTemperature'>;
}
