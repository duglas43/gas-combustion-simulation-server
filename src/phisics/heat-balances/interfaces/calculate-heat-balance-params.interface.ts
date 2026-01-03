import { BoilerCharacteristic } from 'src/phisics/boiler-characteristics/entities';
import { CombustionMaterialBalanceTemperature } from 'src/phisics/combustion-material-balance-temperatures/entities';
import { CombustionMaterialBalance } from 'src/phisics/combustion-material-balances/entities';
import { FuelComposition } from 'src/phisics/fuel-compositions/entities';
import { TemperatureCharacteristic } from 'src/phisics/temperature-characteristics/entities';

export interface CalculateHeatBalanceParams {
  fuelComposition: FuelComposition;
  flueGasTemperatureSet: number;
  boilerCharacteristics: Pick<
    BoilerCharacteristic,
    | 'gasInletTemperature'
    | 'roomAirTemperature'
    | 'nominalSteamProduction'
    | 'blowdownPercentage'
    | 'loadPercentage'
    | 'feedWaterTemperature'
    | 'excessPressureInBoiler'
    | 'actualSteamProduction'
  >;
  temperatureCharacteristics: Pick<
    TemperatureCharacteristic,
    'gasMixtureHeatCapacity' | 'boilerRoomAirHeatCapacity'
  >;
  combustionMaterialBalanceTemperature: Pick<
    CombustionMaterialBalanceTemperature,
    'lowerHeatingValue' | 'theoreticalWetAirConsumption'
  >;
  alphaFlueGasCoefficient: number;
  alphaFlueGasCombustionMaterialBalance: Pick<
    CombustionMaterialBalance,
    | 'theoreticalCO2Volume'
    | 'theoreticalSO2Volume'
    | 'theoreticalWaterVaporVolume'
    | 'theoreticalOxygenVolume'
    | 'theoreticalNitrogenVolume'
  >;
}
