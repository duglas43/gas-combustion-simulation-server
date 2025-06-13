import { BoilerCharacteristic } from 'src/boiler-characteristics/entities';
import { CombustionMaterialBalanceTemperature } from 'src/combustion-material-balance-temperatures/entities';
import { CombustionMaterialBalance } from 'src/combustion-material-balances/entities';
import { FuelComposition } from 'src/fuel-compositions/entities';
import { TemperatureCharacteristic } from 'src/temperature-characteristics/entities';

export interface CalculateHeatBalanceParams {
  fuelComposition: FuelComposition;
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
