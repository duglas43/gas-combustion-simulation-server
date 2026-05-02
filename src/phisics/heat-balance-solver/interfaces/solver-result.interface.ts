import { AirExcessCoefficient } from 'src/phisics/air-excess-coefficients/entities';
import { AirLeakage } from 'src/phisics/air-leakages/entities';
import { CombustionMaterialBalanceTemperature } from 'src/phisics/combustion-material-balance-temperatures/entities';
import { CombustionMaterialBalance } from 'src/phisics/combustion-material-balances/entities';
import { ConvectivePackageHeatBalance } from 'src/phisics/convective-package-heat-balances/entities';
import { EconomizerHeatBalance } from 'src/phisics/economizer-heat-balances/entities';
import { FurnaceHeatBalance } from 'src/phisics/furnace-heat-balances/entities';
import { HeatBalance } from 'src/phisics/heat-balances/entities';
import { TemperatureCharacteristic } from 'src/phisics/temperature-characteristics/entities';

export interface SolverResult {
  combustionMaterialBalanceTemperature: CombustionMaterialBalanceTemperature;
  heatBalance: HeatBalance;
  furnaceHeatBalance: FurnaceHeatBalance;
  firstConvectivePackageHeatBalance: ConvectivePackageHeatBalance;
  secondConvectivePackageHeatBalance: ConvectivePackageHeatBalance;
  economizerHeatBalance: EconomizerHeatBalance;
  airLeakage: AirLeakage;
  temperatureCharacteristics: TemperatureCharacteristic;
  airExcessCoefficients: AirExcessCoefficient[];
  combustionMaterialBalances: CombustionMaterialBalance[];
}
