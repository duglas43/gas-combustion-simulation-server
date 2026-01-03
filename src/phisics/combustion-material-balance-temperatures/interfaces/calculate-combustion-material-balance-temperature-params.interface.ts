import { BoilerCharacteristic } from 'src/phisics/boiler-characteristics/entities';
import { FuelComposition } from 'src/phisics/fuel-compositions/entities';

export interface CalculateCombustionMaterialBalanceTemperatureParams {
  fuelComposition: FuelComposition;
  boilerCharacteristics: Pick<BoilerCharacteristic, 'airHumidityForCombustion'>;
}
