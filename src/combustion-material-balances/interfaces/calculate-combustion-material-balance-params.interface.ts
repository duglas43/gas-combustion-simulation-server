import { AirExcessCoefficient } from 'src/air-excess-coefficients/entities';
import { BoilerCharacteristic } from 'src/boiler-characteristics/entities';
import { CombustionMaterialBalanceTemperature } from 'src/combustion-material-balance-temperatures/entities';
import { FuelComposition } from 'src/fuel-compositions/entities';

export interface CalculateCombustionMaterialBalanceParams {
  fuelComposition: FuelComposition;
  boilerCharacteristics: Pick<
    BoilerCharacteristic,
    | 'airHumidityForCombustion'
    | 'gasHumidityForCombustion'
    | 'flueGasAbsolutePressure'
  >;
  combustionMaterialBalanceTemperature: Pick<
    CombustionMaterialBalanceTemperature,
    'theoreticalWetAirConsumption' | 'theoreticalDryAirConsumption'
  >;
  airExcessCoefficients: Pick<AirExcessCoefficient, 'name' | 'value'>[];
}
