import { AirLeakage } from 'src/phisics/air-leakages/entities';
import { BoilerCharacteristic } from 'src/phisics/boiler-characteristics/entities';
import { CombustionMaterialBalance } from 'src/phisics/combustion-material-balances/entities';
import { ConvectivePackage } from 'src/phisics/convective-packages/entities';
import { HeatBalance } from 'src/phisics/heat-balances/entities';
export interface CalculateConvectivePackageHeatBalanceParams {
  convecivePackageNumber: number;
  acceptedPackageExitTemperature: number;
  convectivePackageCharacteristics: Pick<
    ConvectivePackage,
    | 'channelCrossSectionArea'
    | 'equivalentChannelDiameter'
    | 'relativeTubePitchInRow'
    | 'relativeRowPitch'
    | 'outerTubeDiameter'
    | 'effectiveRadiatingLayerThickness'
    | 'convectivePackageHeatSurfaceArea'
  >;
  boilerCharacteristics: Pick<
    BoilerCharacteristic,
    'excessPressureInBoiler' | 'flueGasAbsolutePressure'
  >;
  heatBalance: Pick<
    HeatBalance,
    | 'heatRetentionCoefficient'
    | 'surroundingAirEnthalpy'
    | 'calculatedHourlyFuelConsumption'
    | 'heatedHeatCarrierFlow'
    | 'calculatedHourlyFuelConsumption'
    | 'heatRetentionCoefficient'
    | 'surroundingAirEnthalpy'
  >;
  airLeakage: Pick<
    AirLeakage,
    'actualFirstConvectiveAirLeakage' | 'actualSecondConvectiveAirLeakage'
  >;
  alphaConvectivePackageCombustionMaterialBalance: Pick<
    CombustionMaterialBalance,
    | 'theoreticalCO2Volume'
    | 'theoreticalWaterVaporVolume'
    | 'theoreticalOxygenVolume'
    | 'theoreticalNitrogenVolume'
    | 'theoreticalSO2Volume'
  >;
  alphaConvectiveAvgCombustionMaterialBalance: Pick<
    CombustionMaterialBalance,
    | 'totalWetCombustionProductsVolume'
    | 'specificVolumeFractionWaterVapor'
    | 'partialPressureTriatomicGases'
    | 'specificVolumeFractionTriatomicGases'
  >;
  previousComponentHeatBalance: {
    calculatedExitTemperature: number;
    combustionProductEnthalpyExit: number;
  };
}
