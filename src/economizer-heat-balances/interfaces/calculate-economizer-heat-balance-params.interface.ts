import { BoilerCharacteristic } from 'src/boiler-characteristics/entities';
import { EconomizerCharacteristic } from 'src/economizer-characteristics/entities';
import { FuelComposition } from 'src/fuel-compositions/entities';
import { CombustionMaterialBalance } from 'src/combustion-material-balances/entities';
import { ConvectivePackageHeatBalance } from 'src/convective-package-heat-balances/entities';
import { AirLeakage } from 'src/air-leakages/entities';
import { HeatBalance } from 'src/heat-balances/entities';

export interface CalculateEconomizerHeatBalanceParams {
  fuelComposition: FuelComposition;
  boilerCharacteristic: BoilerCharacteristic;
  economizerCharacteristic: EconomizerCharacteristic;
  alphaEconomizerCombustionMaterialBalance: CombustionMaterialBalance;
  alphaFurnaceCombusitonMaterialBalance: CombustionMaterialBalance;
  convectivePackageHeatBalance: ConvectivePackageHeatBalance;
  airLeakage: AirLeakage;
  heatBalance: HeatBalance;
}
