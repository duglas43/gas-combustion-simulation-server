import { AirExcessCoefficient } from 'src/phisics/air-excess-coefficients/entities';
import { BoilerCharacteristic } from 'src/phisics/boiler-characteristics/entities';
import { CombustionMaterialBalanceTemperature } from 'src/phisics/combustion-material-balance-temperatures/entities';
import { FuelComposition } from 'src/phisics/fuel-compositions/entities';

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
