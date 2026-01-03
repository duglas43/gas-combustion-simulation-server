import { BoilerCharacteristic } from 'src/phisics/boiler-characteristics/entities';
import { FuelComposition } from 'src/phisics/fuel-compositions/entities';
import { HeatBalance } from 'src/phisics/heat-balances/entities';
import { AirLeakage } from 'src/phisics/air-leakages/entities';
import { TemperatureCharacteristic } from 'src/phisics/temperature-characteristics/entities';
import { CombustionMaterialBalance } from 'src/phisics/combustion-material-balances/entities';
import { FurnaceCharacteristic } from 'src/phisics/furnace-characteristics/entities';
import { CombustionMaterialBalanceTemperature } from 'src/phisics/combustion-material-balance-temperatures/entities';

export interface CalculateFurnaceHeatBalanceParams {
  fuelComposition: FuelComposition;
  acceptedAdiabaticCombustionTemperature: number;
  acceptedFurnaceExitTemperature: number;
  boilerCharacteristics: Pick<BoilerCharacteristic, 'flueGasAbsolutePressure'>;
  heatBalance: Pick<
    HeatBalance,
    | 'surroundingAirEnthalpy'
    | 'availableHeatInputToBoiler'
    | 'heatLossDueToChemicalIncompleteCombustionPercentage'
    | 'heatInputFromAir'
    | 'heatRetentionCoefficient'
    | 'calculatedHourlyFuelConsumption'
    | 'heatedHeatCarrierFlow'
  >;
  airLeakage: Pick<AirLeakage, 'actualFurnaceAirLeakage'>;
  temperatureCharacteristics: Pick<
    TemperatureCharacteristic,
    | 'combustionAirHeatCapacity'
    | 'combustionAirTemperature'
    | 'recirculationRate'
  >;
  furnaceCharacteristic: Pick<
    FurnaceCharacteristic,
    | 'screenContaminationFactor'
    | 'firstScreenArea'
    | 'firstScreenAngleCoefficient'
    | 'secondScreenArea'
    | 'secondScreenAngleCoefficient'
    | 'thirdScreenArea'
    | 'thirdScreenAngleCoefficient'
    | 'fourthScreenArea'
    | 'fourthScreenAngleCoefficient'
    | 'fifthScreenArea'
    | 'fifthScreenAngleCoefficient'
    | 'totalWallSurfaceArea'
    | 'totalBurnersInBoiler'
    | 'firstBurnerRowHeight'
    | 'totalBurnersInBoiler'
    | 'furnaceHeight'
    | 'effectiveRadiatingLayerThickness'
    | 'burnersInFirstRow'
    | 'totalRadiantHeatSurfaceArea'
    | 'furnaceVolume'
  >;
  alphaFurnaceCoefficient: number;
  alphaFurnaceCombustionMaterialBalance: Pick<
    CombustionMaterialBalance,
    | 'theoreticalCO2Volume'
    | 'theoreticalNitrogenVolume'
    | 'theoreticalOxygenVolume'
    | 'theoreticalSO2Volume'
    | 'theoreticalWaterVaporVolume'
  >;
  alphaFurnaceAvgCombustionMaterialBalance: Pick<
    CombustionMaterialBalance,
    | 'theoreticalCO2Volume'
    | 'theoreticalNitrogenVolume'
    | 'theoreticalOxygenVolume'
    | 'theoreticalSO2Volume'
    | 'theoreticalWaterVaporVolume'
    | 'specificVolumeFractionWaterVapor'
    | 'specificVolumeFractionTriatomicGases'
    | 'partialPressureTriatomicGases'
    | 'totalWetCombustionProductsVolume'
  >;
  alphaFlueGasCoefficient: number;
  combustionMaterialBalanceTemperature: Pick<
    CombustionMaterialBalanceTemperature,
    'theoreticalWetAirConsumption'
  >;
}
