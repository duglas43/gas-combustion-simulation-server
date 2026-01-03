import { BoilerCharacteristic } from 'src/phisics/boiler-characteristics/entities';
import { EconomizerCharacteristic } from 'src/phisics/economizer-characteristics/entities';
import { FuelComposition } from 'src/phisics/fuel-compositions/entities';
import { CombustionMaterialBalance } from 'src/phisics/combustion-material-balances/entities';
import { ConvectivePackageHeatBalance } from 'src/phisics/convective-package-heat-balances/entities';
import { AirLeakage } from 'src/phisics/air-leakages/entities';
import { HeatBalance } from 'src/phisics/heat-balances/entities';

export interface CalculateEconomizerHeatBalanceParams {
  fuelComposition: FuelComposition;
  acceptedEconomizerExitTemperature: number;
  boilerCharacteristics: BoilerCharacteristic;
  economizerCharacteristic: EconomizerCharacteristic;
  alphaEconomizerCombustionMaterialBalance: CombustionMaterialBalance;
  alphaEconomizerAvgCombustionMaterialBalance: CombustionMaterialBalance;
  alphaFurnaceCombusitonMaterialBalance: CombustionMaterialBalance;
  convectivePackageHeatBalance: ConvectivePackageHeatBalance;
  airLeakage: AirLeakage;
  heatBalance: HeatBalance;
}
