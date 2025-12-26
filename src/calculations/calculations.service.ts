import { Injectable } from '@nestjs/common';
import { CreateCalculationDto } from './dto/create-calculation.dto';
import { EconomizerCharacteristicsService } from 'src/economizer-characteristics/economizer-characteristics.service';
import { BoilerCharacteristicsService } from 'src/boiler-characteristics/boiler-characteristics.service';
import { FuelCompositionsService } from 'src/fuel-compositions/fuel-compositions.service';
import { FurnaceCharacteristicsService } from 'src/furnace-characteristics/furnace-characteristics.service';
import { ConvectivePackagesService } from 'src/convective-packages/convective-packages.service';
import { AirLeakagesService } from 'src/air-leakages/air-leakages.service';
import { TemperatureCharacteristicsService } from 'src/temperature-characteristics/temparature-characteristics.service';
import { CombustionMaterialBalanceTemperaturesService } from 'src/combustion-material-balance-temperatures/combustion-material-balance-temperatures.service';
import { AirExcessCoefficientsService } from 'src/air-excess-coefficients/air-excess-coefficients.service';
import { CombustionMaterialBalancesService } from 'src/combustion-material-balances/combustion-material-balances.service';
import { HeatBalancesService } from 'src/heat-balances/heat-balances.service';
import { FurnaceHeatBalancesService } from 'src/furnace-heat-balances/furnace-heat-balances.service';
import { ConvectivePackageHeatBalancesService } from 'src/convective-package-heat-balances/convective-package-heat-balances.service';
import { EconomizerHeatBalancesService } from 'src/economizer-heat-balances/economizer-heat-balances.service';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';
import { EconomizerCharacteristic } from 'src/economizer-characteristics/entities';
import { BoilerCharacteristic } from 'src/boiler-characteristics/entities';
import { FuelComposition } from 'src/fuel-compositions/entities';
import { FurnaceCharacteristic } from 'src/furnace-characteristics/entities';
import { ConvectivePackage } from 'src/convective-packages/entities';
import { AirLeakage } from 'src/air-leakages/entities';
import { TemperatureCharacteristic } from 'src/temperature-characteristics/entities';
import { CombustionMaterialBalance } from 'src/combustion-material-balances/entities';
import { AirExcessCoefficient } from 'src/air-excess-coefficients/entities';
import { CombustionMaterialBalanceTemperature } from 'src/combustion-material-balance-temperatures/entities';
import { HeatBalance } from 'src/heat-balances/entities';
import { FurnaceHeatBalance } from 'src/furnace-heat-balances/entities';
import { ConvectivePackageHeatBalance } from 'src/convective-package-heat-balances/entities';
import { EconomizerHeatBalance } from 'src/economizer-heat-balances/entities';

@Injectable()
export class CalculationsService {
  constructor(
    private boilerCharacteristicsService: BoilerCharacteristicsService,
    private fuelCompositionsService: FuelCompositionsService,
    private furnaceCharacteristicsService: FurnaceCharacteristicsService,
    private convectivePackagesService: ConvectivePackagesService,
    private airLeakagesService: AirLeakagesService,
    private temperatureCharacteristicsService: TemperatureCharacteristicsService,
    private combustionMaterialBalanceTemperaturesService: CombustionMaterialBalanceTemperaturesService,
    private airExcessCoefficientsService: AirExcessCoefficientsService,
    private combustionMaterialBalancesService: CombustionMaterialBalancesService,
    private heatBalancesService: HeatBalancesService,
    private furnaceHeatBalancesService: FurnaceHeatBalancesService,
    private convectivePackageHeatBalancesService: ConvectivePackageHeatBalancesService,
    private economizerCharacteristicsService: EconomizerCharacteristicsService,
    private economizerHeatBalancesService: EconomizerHeatBalancesService,
    @InjectPinoLogger(CalculationsService.name)
    private readonly logger: PinoLogger,
  ) {}

  async create(dto: CreateCalculationDto) {
    const acceptedValuesMap = {
      economizerExitTemperature: 153.2773346,
      firstConvectivePackageExitTemperature: 290.1,
      secondConvectivePackageExitTemperature: 215.7,
      furnaceExitTemperature: 840.4251947,
      adiabaticCombustionTemperature: 1855.316033,
    };
    const discrepancyThreshold = 0.001;
    const furnaceDichotomyDivisionPercentage = 50;
    const convectivePackage1DichotomyDivisionPercentage = 20;
    const convectivePackage2DichotomyDivisionPercentage = 20;
    const economizerDichotomyDivisionPercentage = 10;
    let economizerCharacteristic: EconomizerCharacteristic;
    let boilerCharacteristic: BoilerCharacteristic;
    let fuelComposition: FuelComposition;
    let furnaceCharacteristic: FurnaceCharacteristic;
    let convectivePackages: ConvectivePackage[];
    let airLeakage: AirLeakage;
    let temperatureCharacteristic: TemperatureCharacteristic;
    let combustionMaterialBalanceTemperature: CombustionMaterialBalanceTemperature;
    let airExcessCoefficients: AirExcessCoefficient[];
    let combustionMaterialBalances: CombustionMaterialBalance[];
    let heatBalance: HeatBalance;
    let furnaceHeatBalance: FurnaceHeatBalance;
    let firstConvectivePackageHeatBalance: ConvectivePackageHeatBalance;
    let secondConvectivePackageHeatBalance: ConvectivePackageHeatBalance;
    let economizerHeatBalance: EconomizerHeatBalance;

    let needRecalculation = true;

    while (needRecalculation) {
      needRecalculation = false;
      economizerCharacteristic =
        this.economizerCharacteristicsService.calculate();
      boilerCharacteristic = this.boilerCharacteristicsService.calculate(
        dto.boilerCharacteristics,
      );

      fuelComposition = this.fuelCompositionsService.calculate({
        createFuelCompositionDto: dto.fuelComposition,
        boilerCharacreristics: {
          gasInletTemperature: boilerCharacteristic.gasInletTemperature,
        },
      });

      furnaceCharacteristic = this.furnaceCharacteristicsService.calculate({
        createFurnaceCharacteristicDto: dto.furnaceCharacteristics,
      });

      convectivePackages = this.convectivePackagesService.calculate({
        createConvectivePackageDtos: dto.convectivePackagesParameters,
      });

      airLeakage = this.airLeakagesService.calculate({
        boilerCharacreristics: {
          actualSteamProduction: boilerCharacteristic.actualSteamProduction,
          nominalSteamProduction: boilerCharacteristic.nominalSteamProduction,
        },
      });

      temperatureCharacteristic =
        this.temperatureCharacteristicsService.calculate({
          boilerCharacteristics: {
            roomAirTemperature: boilerCharacteristic.roomAirTemperature,
          },
          fuelComposition,
        });

      combustionMaterialBalanceTemperature =
        this.combustionMaterialBalanceTemperaturesService.calculate({
          fuelComposition,
          boilerCharacteristics: {
            airHumidityForCombustion:
              boilerCharacteristic.airHumidityForCombustion,
          },
        });
      airExcessCoefficients = this.airExcessCoefficientsService.calculate({
        airLeakage: {
          actualEconomizerAirLeakage: airLeakage.actualEconomizerAirLeakage,
          actualFirstConvectiveAirLeakage:
            airLeakage.actualFirstConvectiveAirLeakage,
          actualFurnaceAirLeakage: airLeakage.actualFurnaceAirLeakage,
          actualSecondConvectiveAirLeakage:
            airLeakage.actualSecondConvectiveAirLeakage,
        },
        boilerCharacteristic: {
          excessAirCoefficient: boilerCharacteristic.excessAirCoefficient,
        },
      });
      combustionMaterialBalances =
        this.combustionMaterialBalancesService.calculate({
          airExcessCoefficients,
          boilerCharacteristics: {
            airHumidityForCombustion:
              boilerCharacteristic.airHumidityForCombustion,
            gasHumidityForCombustion:
              boilerCharacteristic.gasHumidityForCombustion,
            flueGasAbsolutePressure:
              boilerCharacteristic.flueGasAbsolutePressure,
          },
          combustionMaterialBalanceTemperature: {
            theoreticalDryAirConsumption:
              combustionMaterialBalanceTemperature.theoreticalDryAirConsumption,
            theoreticalWetAirConsumption:
              combustionMaterialBalanceTemperature.theoreticalWetAirConsumption,
          },
          fuelComposition,
        });
      const alphaFlueGasCoefficient = airExcessCoefficients.find(
        (airExcessCoefficient) => airExcessCoefficient.name === 'alphaFlueGas',
      );
      const alphaFlueGasCombustionMaterialBalance =
        combustionMaterialBalances.find(
          (combustionMaterialBalance) =>
            combustionMaterialBalance.airExcessCoefficientName ===
            'alphaFlueGas',
        );

      heatBalance = this.heatBalancesService.calculate({
        alphaFlueGasCoefficient: alphaFlueGasCoefficient.value,
        alphaFlueGasCombustionMaterialBalance,
        flueGasTemperatureSet: acceptedValuesMap.economizerExitTemperature,
        boilerCharacteristics: {
          actualSteamProduction: boilerCharacteristic.actualSteamProduction,
          blowdownPercentage: boilerCharacteristic.blowdownPercentage,
          excessPressureInBoiler: boilerCharacteristic.excessPressureInBoiler,
          feedWaterTemperature: boilerCharacteristic.feedWaterTemperature,
          gasInletTemperature: boilerCharacteristic.gasInletTemperature,
          loadPercentage: boilerCharacteristic.loadPercentage,
          nominalSteamProduction: boilerCharacteristic.nominalSteamProduction,
          roomAirTemperature: boilerCharacteristic.roomAirTemperature,
        },
        combustionMaterialBalanceTemperature,
        fuelComposition,
        temperatureCharacteristics: {
          boilerRoomAirHeatCapacity:
            temperatureCharacteristic.boilerRoomAirHeatCapacity,
          gasMixtureHeatCapacity:
            temperatureCharacteristic.gasMixtureHeatCapacity,
        },
      });

      const alphaFurnaceCoefficient = airExcessCoefficients.find(
        (airExcessCoefficient) => airExcessCoefficient.name === 'alphaFurnace',
      );
      const alphaFurnaceAvgCoefficient = airExcessCoefficients.find(
        (airExcessCoefficient) =>
          airExcessCoefficient.name === 'alphaFurnaceAvg',
      );
      const alphaFurnaceCombustionMaterialBalance =
        combustionMaterialBalances.find(
          (combustionMaterialBalance) =>
            combustionMaterialBalance.airExcessCoefficientName ===
            alphaFurnaceCoefficient.name,
        );
      const alphaFurnaceAvgCombustionMaterialBalance =
        combustionMaterialBalances.find(
          (combustionMaterialBalance) =>
            combustionMaterialBalance.airExcessCoefficientName ===
            alphaFurnaceAvgCoefficient.name,
        );

      furnaceHeatBalance = this.furnaceHeatBalancesService.calculate({
        airLeakage,
        acceptedFurnaceExitTemperature:
          acceptedValuesMap.furnaceExitTemperature,
        acceptedAdiabaticCombustionTemperature:
          acceptedValuesMap.adiabaticCombustionTemperature,
        alphaFurnaceCoefficient: alphaFurnaceCoefficient.value,
        alphaFurnaceCombustionMaterialBalance,
        alphaFurnaceAvgCombustionMaterialBalance,
        boilerCharacteristics: {
          flueGasAbsolutePressure: boilerCharacteristic.flueGasAbsolutePressure,
        },
        combustionMaterialBalanceTemperature,
        fuelComposition,
        furnaceCharacteristic,
        heatBalance,
        alphaFlueGasCoefficient: alphaFlueGasCoefficient.value,
        temperatureCharacteristic,
      });

      if (
        Math.abs(
          acceptedValuesMap.furnaceExitTemperature -
            furnaceHeatBalance.calculatedFurnaceExitTemperature,
        ) >= discrepancyThreshold
      ) {
        if (
          acceptedValuesMap.furnaceExitTemperature <
          furnaceHeatBalance.calculatedFurnaceExitTemperature
        ) {
          acceptedValuesMap.furnaceExitTemperature =
            acceptedValuesMap.furnaceExitTemperature +
            Math.abs(
              acceptedValuesMap.furnaceExitTemperature -
                furnaceHeatBalance.calculatedFurnaceExitTemperature,
            ) /
              2;
        } else {
          acceptedValuesMap.furnaceExitTemperature =
            acceptedValuesMap.furnaceExitTemperature -
            Math.abs(
              acceptedValuesMap.furnaceExitTemperature -
                furnaceHeatBalance.calculatedFurnaceExitTemperature,
            ) /
              2;
        }
        needRecalculation = true;
        continue;
      }
      if (
        Math.abs(
          acceptedValuesMap.adiabaticCombustionTemperature -
            furnaceHeatBalance.calculatedAdiabaticCombustionTemperature,
        ) >= discrepancyThreshold
      ) {
        if (
          acceptedValuesMap.adiabaticCombustionTemperature <
          furnaceHeatBalance.calculatedAdiabaticCombustionTemperature
        ) {
          acceptedValuesMap.adiabaticCombustionTemperature =
            acceptedValuesMap.adiabaticCombustionTemperature +
            Math.abs(
              acceptedValuesMap.adiabaticCombustionTemperature -
                furnaceHeatBalance.calculatedAdiabaticCombustionTemperature,
            ) /
              2;
        } else {
          acceptedValuesMap.adiabaticCombustionTemperature =
            acceptedValuesMap.adiabaticCombustionTemperature -
            Math.abs(
              acceptedValuesMap.adiabaticCombustionTemperature -
                furnaceHeatBalance.calculatedAdiabaticCombustionTemperature,
            ) /
              2;
        }
        needRecalculation = true;
        continue;
      }

      const firstAlphaConvectiveAvgCoefficient = airExcessCoefficients.find(
        (airExcessCoefficient) =>
          airExcessCoefficient.name === 'alphaConvectivePackage1Avg',
      );
      const firstAlphaConvectivePackageCoefficient = airExcessCoefficients.find(
        (airExcessCoefficient) =>
          airExcessCoefficient.name === 'alphaConvectivePackage1',
      );
      const firstAlphaConvectiveAvgCombustionMaterialBalance =
        combustionMaterialBalances.find(
          (combustionMaterialBalance) =>
            combustionMaterialBalance.airExcessCoefficientName ===
            firstAlphaConvectiveAvgCoefficient.name,
        );
      const firstAlphaConvectivePackageCombustionMaterialBalance =
        combustionMaterialBalances.find(
          (combustionMaterialBalance) =>
            combustionMaterialBalance.airExcessCoefficientName ===
            firstAlphaConvectivePackageCoefficient.name,
        );
      const secondAlphaConvectiveAvgCoefficient = airExcessCoefficients.find(
        (airExcessCoefficient) =>
          airExcessCoefficient.name === 'alphaConvectivePackage2Avg',
      );
      const secondAlphaConvectivePackageCoefficient =
        airExcessCoefficients.find(
          (airExcessCoefficient) =>
            airExcessCoefficient.name === 'alphaConvectivePackage2',
        );
      const secondAlphaConvectiveAvgCombustionMaterialBalance =
        combustionMaterialBalances.find(
          (combustionMaterialBalance) =>
            combustionMaterialBalance.airExcessCoefficientName ===
            secondAlphaConvectiveAvgCoefficient.name,
        );
      const secondAlphaConvectivePackageCombustionMaterialBalance =
        combustionMaterialBalances.find(
          (combustionMaterialBalance) =>
            combustionMaterialBalance.airExcessCoefficientName ===
            secondAlphaConvectivePackageCoefficient.name,
        );

      firstConvectivePackageHeatBalance =
        this.convectivePackageHeatBalancesService.calculate({
          convecivePackageNumber: 1,
          acceptedPackageExitTemperature:
            acceptedValuesMap.firstConvectivePackageExitTemperature,
          convectivePackageCharacteristics: convectivePackages.find(
            (cp) => cp.packageNumber === 1,
          ),
          airLeakage,
          alphaConvectiveAvgCombustionMaterialBalance:
            firstAlphaConvectiveAvgCombustionMaterialBalance,
          alphaConvectivePackageCombustionMaterialBalance:
            firstAlphaConvectivePackageCombustionMaterialBalance,
          boilerCharacteristics: {
            excessPressureInBoiler: boilerCharacteristic.excessPressureInBoiler,
            flueGasAbsolutePressure:
              boilerCharacteristic.flueGasAbsolutePressure,
          },
          previousComponentHeatBalance: {
            calculatedExitTemperature:
              furnaceHeatBalance.calculatedFurnaceExitTemperature,
            combustionProductEnthalpyExit:
              furnaceHeatBalance.combustionProductEnthalpyExit,
          },
          heatBalance,
        });

      if (
        acceptedValuesMap.firstConvectivePackageExitTemperature -
          firstConvectivePackageHeatBalance.heatedMediumTemperature <=
        0
      ) {
        acceptedValuesMap.adiabaticCombustionTemperature =
          firstConvectivePackageHeatBalance.heatedMediumTemperature +
          furnaceDichotomyDivisionPercentage;
        acceptedValuesMap.firstConvectivePackageExitTemperature =
          firstConvectivePackageHeatBalance.heatedMediumTemperature +
          furnaceDichotomyDivisionPercentage;
        needRecalculation = true;
        continue;
      } else {
        if (
          Math.abs(
            acceptedValuesMap.firstConvectivePackageExitTemperature -
              firstConvectivePackageHeatBalance.calculatedPackageExitTemperature,
          ) >= discrepancyThreshold
        ) {
          if (
            acceptedValuesMap.firstConvectivePackageExitTemperature -
              firstConvectivePackageHeatBalance.calculatedPackageExitTemperature <
            discrepancyThreshold
          ) {
            acceptedValuesMap.firstConvectivePackageExitTemperature =
              acceptedValuesMap.firstConvectivePackageExitTemperature +
              Math.abs(
                (acceptedValuesMap.firstConvectivePackageExitTemperature -
                  firstConvectivePackageHeatBalance.calculatedPackageExitTemperature) *
                  0.01 *
                  convectivePackage1DichotomyDivisionPercentage,
              );
          } else {
            acceptedValuesMap.firstConvectivePackageExitTemperature =
              acceptedValuesMap.firstConvectivePackageExitTemperature -
              Math.abs(
                (acceptedValuesMap.firstConvectivePackageExitTemperature -
                  firstConvectivePackageHeatBalance.calculatedPackageExitTemperature) *
                  0.01 *
                  convectivePackage1DichotomyDivisionPercentage,
              );
          }
          needRecalculation = true;
          continue;
        }
      }
      secondConvectivePackageHeatBalance =
        this.convectivePackageHeatBalancesService.calculate({
          convecivePackageNumber: 2,
          acceptedPackageExitTemperature:
            acceptedValuesMap.secondConvectivePackageExitTemperature,
          convectivePackageCharacteristics: convectivePackages.find(
            (cp) => cp.packageNumber === 2,
          ),
          airLeakage,
          alphaConvectiveAvgCombustionMaterialBalance:
            secondAlphaConvectiveAvgCombustionMaterialBalance,
          alphaConvectivePackageCombustionMaterialBalance:
            secondAlphaConvectivePackageCombustionMaterialBalance,
          boilerCharacteristics: {
            excessPressureInBoiler: boilerCharacteristic.excessPressureInBoiler,
            flueGasAbsolutePressure:
              boilerCharacteristic.flueGasAbsolutePressure,
          },
          previousComponentHeatBalance: {
            calculatedExitTemperature:
              firstConvectivePackageHeatBalance.calculatedPackageExitTemperature,
            combustionProductEnthalpyExit:
              firstConvectivePackageHeatBalance.combustionProductEnthalpyExit,
          },
          heatBalance,
        });

      if (
        acceptedValuesMap.secondConvectivePackageExitTemperature -
          secondConvectivePackageHeatBalance.heatedMediumTemperature <=
        0
      ) {
        acceptedValuesMap.adiabaticCombustionTemperature =
          secondConvectivePackageHeatBalance.heatedMediumTemperature +
          furnaceDichotomyDivisionPercentage;
        acceptedValuesMap.secondConvectivePackageExitTemperature =
          secondConvectivePackageHeatBalance.heatedMediumTemperature +
          furnaceDichotomyDivisionPercentage;
        needRecalculation = true;
        continue;
      } else {
        if (
          Math.abs(
            acceptedValuesMap.secondConvectivePackageExitTemperature -
              secondConvectivePackageHeatBalance.calculatedPackageExitTemperature,
          ) >= discrepancyThreshold
        ) {
          if (
            acceptedValuesMap.secondConvectivePackageExitTemperature -
              secondConvectivePackageHeatBalance.calculatedPackageExitTemperature <
            discrepancyThreshold
          ) {
            acceptedValuesMap.secondConvectivePackageExitTemperature =
              acceptedValuesMap.secondConvectivePackageExitTemperature +
              Math.abs(
                (acceptedValuesMap.secondConvectivePackageExitTemperature -
                  secondConvectivePackageHeatBalance.calculatedPackageExitTemperature) *
                  0.01 *
                  convectivePackage2DichotomyDivisionPercentage,
              );
          } else {
            acceptedValuesMap.secondConvectivePackageExitTemperature =
              acceptedValuesMap.secondConvectivePackageExitTemperature -
              Math.abs(
                (acceptedValuesMap.secondConvectivePackageExitTemperature -
                  secondConvectivePackageHeatBalance.calculatedPackageExitTemperature) *
                  0.01 *
                  convectivePackage2DichotomyDivisionPercentage,
              );
          }
          needRecalculation = true;
          continue;
        }
      }

      const alphaEconomizerAvgCoefficient = airExcessCoefficients.find(
        (airExcessCoefficient) =>
          airExcessCoefficient.name === 'alphaEconomizerAvg',
      );
      const alphaEconomizerCoefficient = airExcessCoefficients.find(
        (airExcessCoefficient) =>
          airExcessCoefficient.name === 'alphaEconomizer',
      );
      const alphaEconomizerAvgCombustionMaterialBalance =
        combustionMaterialBalances.find(
          (combustionMaterialBalance) =>
            combustionMaterialBalance.airExcessCoefficientName ===
            alphaEconomizerAvgCoefficient.name,
        );
      const alphaEconomizerCombustionMaterialBalance =
        combustionMaterialBalances.find(
          (combustionMaterialBalance) =>
            combustionMaterialBalance.airExcessCoefficientName ===
            alphaEconomizerCoefficient.name,
        );

      const alphaFurnaceCombusitonMaterialBalance =
        combustionMaterialBalances.find(
          (combustionMaterialBalance) =>
            combustionMaterialBalance.airExcessCoefficientName ===
            alphaFurnaceCoefficient.name,
        );

      economizerHeatBalance = this.economizerHeatBalancesService.calculate({
        airLeakage,
        acceptedEconomizerExitTemperature:
          acceptedValuesMap.economizerExitTemperature,
        alphaEconomizerCombustionMaterialBalance,
        alphaEconomizerAvgCombustionMaterialBalance,
        alphaFurnaceCombusitonMaterialBalance,
        boilerCharacteristic,
        convectivePackageHeatBalance: secondConvectivePackageHeatBalance,
        economizerCharacteristic,
        fuelComposition,
        heatBalance,
      });
      if (
        Math.abs(
          acceptedValuesMap.economizerExitTemperature -
            economizerHeatBalance.calculatedEconomizerExitTemperature,
        ) >= discrepancyThreshold
      ) {
        if (
          acceptedValuesMap.economizerExitTemperature -
            economizerHeatBalance.calculatedEconomizerExitTemperature <
          discrepancyThreshold
        ) {
          acceptedValuesMap.economizerExitTemperature =
            acceptedValuesMap.economizerExitTemperature +
            Math.abs(
              (acceptedValuesMap.economizerExitTemperature -
                economizerHeatBalance.calculatedEconomizerExitTemperature) *
                0.01 *
                economizerDichotomyDivisionPercentage,
            );
        } else {
          acceptedValuesMap.economizerExitTemperature =
            acceptedValuesMap.economizerExitTemperature -
            Math.abs(
              (acceptedValuesMap.economizerExitTemperature -
                economizerHeatBalance.calculatedEconomizerExitTemperature) *
                0.01 *
                economizerDichotomyDivisionPercentage,
            );
        }
        needRecalculation = true;
        continue;
      }
    }

    const result = {
      boilerCharacteristic: this.convertIntToFloat(boilerCharacteristic),
      fuelComposition: this.convertIntToFloat(fuelComposition),
      furnaceCharacteristic: this.convertIntToFloat(furnaceCharacteristic),
      convectivePackages: convectivePackages.map((cp) =>
        this.convertIntToFloat(cp),
      ),
      airLeakage: this.convertIntToFloat(airLeakage),
      temperatureCharacteristic: this.convertIntToFloat(
        temperatureCharacteristic,
      ),
      combustionMaterialBalanceTemperature: this.convertIntToFloat(
        combustionMaterialBalanceTemperature,
      ),
      airExcessCoefficients: airExcessCoefficients.map((aec) =>
        this.convertIntToFloat(aec),
      ),
      combustionMaterialBalances: combustionMaterialBalances.map((cmb) =>
        this.convertIntToFloat(cmb),
      ),
      heatBalance: this.convertIntToFloat(heatBalance),
      furnaceHeatBalance: this.convertIntToFloat(furnaceHeatBalance),
      firstConvectivePackageHeatBalance: this.convertIntToFloat(
        firstConvectivePackageHeatBalance,
      ),
      secondConvectivePackageHeatBalance: this.convertIntToFloat(
        secondConvectivePackageHeatBalance,
      ),
      economizerCharacteristic: this.convertIntToFloat(
        economizerCharacteristic,
      ),
      economizerHeatBalance: this.convertIntToFloat(economizerHeatBalance),
    };

    this.logger.info({
      ...result,
      message: 'Calculation result',
    });

    return result;
  }

  private convertIntToFloat(obj: object): Record<string, any> {
    const result: Record<string, any> = {};

    for (const key of Object.keys(obj)) {
      const val = (obj as any)[key];
      if (typeof val === 'number' && Number.isInteger(val)) {
        result[key] = val + 0.0;
      } else {
        result[key] = val;
      }
    }
    return result;
  }
}
