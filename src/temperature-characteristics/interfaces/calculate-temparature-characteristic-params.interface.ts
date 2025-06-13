import { BoilerCharacteristic } from 'src/boiler-characteristics/entities';
import { FuelComposition } from 'src/fuel-compositions/entities';

export interface CalculateTemperatureCharacteristicParams {
  fuelComposition: FuelComposition;
  boilerCharacteristics: Pick<BoilerCharacteristic, 'roomAirTemperature'>;
}
