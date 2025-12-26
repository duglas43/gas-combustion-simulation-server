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
import { AirExcessCoefficient } from 'src/air-excess-coefficients/entities';
import { CombustionMaterialBalance } from 'src/combustion-material-balances/entities';

@Injectable()
export class CalculationsService {
  constructor(
    private readonly boilerCharacteristicsService: BoilerCharacteristicsService,
    private readonly fuelCompositionsService: FuelCompositionsService,
    private readonly furnaceCharacteristicsService: FurnaceCharacteristicsService,
    private readonly convectivePackagesService: ConvectivePackagesService,
    private readonly airLeakagesService: AirLeakagesService,
    private readonly temperatureCharacteristicsService: TemperatureCharacteristicsService,
    private readonly combustionMaterialBalanceTemperaturesService: CombustionMaterialBalanceTemperaturesService,
    private readonly airExcessCoefficientsService: AirExcessCoefficientsService,
    private readonly combustionMaterialBalancesService: CombustionMaterialBalancesService,
    private readonly heatBalancesService: HeatBalancesService,
    private readonly furnaceHeatBalancesService: FurnaceHeatBalancesService,
    private readonly convectivePackageHeatBalancesService: ConvectivePackageHeatBalancesService,
    private readonly economizerCharacteristicsService: EconomizerCharacteristicsService,
    private readonly economizerHeatBalancesService: EconomizerHeatBalancesService,
    @InjectPinoLogger(CalculationsService.name)
    private readonly logger: PinoLogger,
  ) {}

  create(dto: CreateCalculationDto) {
    const acceptedValuesMap = {
      furnaceExitTemperature: 840.4251947,
      adiabaticCombustionTemperature: 1855.316033,
      firstConvectivePackageExitTemperature: 290.1,
      secondConvectivePackageExitTemperature: 215.7,
      economizerExitTemperature: 153.2773346,
    };

    const THRESHOLD = 0.001;
    let needRecalculation = true;
    let result: any;

    while (needRecalculation) {
      needRecalculation = false;

      const economizerCharacteristic =
        this.economizerCharacteristicsService.calculate();

      const boilerCharacteristics = this.boilerCharacteristicsService.calculate(
        dto.boilerCharacteristics,
      );

      const fuelComposition = this.fuelCompositionsService.calculate({
        createFuelCompositionDto: dto.fuelComposition,
        boilerCharacreristics: {
          gasInletTemperature: boilerCharacteristics.gasInletTemperature,
        },
      });

      const furnaceCharacteristic =
        this.furnaceCharacteristicsService.calculate({
          createFurnaceCharacteristicDto: dto.furnaceCharacteristics,
        });

      const convectivePackages = this.convectivePackagesService.calculate({
        createConvectivePackageDtos: dto.convectivePackagesParameters,
      });

      const airLeakage = this.airLeakagesService.calculate({
        boilerCharacreristics: {
          actualSteamProduction: boilerCharacteristics.actualSteamProduction,
          nominalSteamProduction: boilerCharacteristics.nominalSteamProduction,
        },
      });

      const temperatureCharacteristics =
        this.temperatureCharacteristicsService.calculate({
          boilerCharacteristics: {
            roomAirTemperature: boilerCharacteristics.roomAirTemperature,
          },
          fuelComposition,
        });

      const combustionMaterialBalanceTemperature =
        this.combustionMaterialBalanceTemperaturesService.calculate({
          fuelComposition,
          boilerCharacteristics: {
            airHumidityForCombustion:
              boilerCharacteristics.airHumidityForCombustion,
          },
        });

      const airExcessCoefficients = this.airExcessCoefficientsService.calculate(
        {
          airLeakage,
          boilerCharacteristic: {
            excessAirCoefficient: boilerCharacteristics.excessAirCoefficient,
          },
        },
      );

      const combustionMaterialBalances =
        this.combustionMaterialBalancesService.calculate({
          airExcessCoefficients,
          boilerCharacteristics: {
            airHumidityForCombustion:
              boilerCharacteristics.airHumidityForCombustion,
            gasHumidityForCombustion:
              boilerCharacteristics.gasHumidityForCombustion,
            flueGasAbsolutePressure:
              boilerCharacteristics.flueGasAbsolutePressure,
          },
          combustionMaterialBalanceTemperature,
          fuelComposition,
        });

      const alphaFlueGas = this.getAlpha(
        'alphaFlueGas',
        airExcessCoefficients,
        combustionMaterialBalances,
      );
      const alphaFurnace = this.getAlpha(
        'alphaFurnace',
        airExcessCoefficients,
        combustionMaterialBalances,
      );
      const alphaFurnaceAvg = this.getAlpha(
        'alphaFurnaceAvg',
        airExcessCoefficients,
        combustionMaterialBalances,
      );

      const heatBalance = this.heatBalancesService.calculate({
        alphaFlueGasCoefficient: alphaFlueGas.coefficient.value,
        alphaFlueGasCombustionMaterialBalance: alphaFlueGas.balance,
        flueGasTemperatureSet: acceptedValuesMap.economizerExitTemperature,
        boilerCharacteristics,
        combustionMaterialBalanceTemperature,
        fuelComposition,
        temperatureCharacteristics,
      });

      const furnaceHeatBalance = this.furnaceHeatBalancesService.calculate({
        airLeakage,
        acceptedFurnaceExitTemperature:
          acceptedValuesMap.furnaceExitTemperature,
        acceptedAdiabaticCombustionTemperature:
          acceptedValuesMap.adiabaticCombustionTemperature,
        alphaFurnaceCoefficient: alphaFurnace.coefficient.value,
        alphaFurnaceCombustionMaterialBalance: alphaFurnace.balance,
        alphaFurnaceAvgCombustionMaterialBalance: alphaFurnaceAvg.balance,
        boilerCharacteristics: {
          flueGasAbsolutePressure:
            boilerCharacteristics.flueGasAbsolutePressure,
        },
        combustionMaterialBalanceTemperature,
        fuelComposition,
        furnaceCharacteristic,
        heatBalance,
        alphaFlueGasCoefficient: alphaFlueGas.coefficient.value,
        temperatureCharacteristics,
      });

      let adjustAcceptedValue = this.adjustAcceptedValue(
        acceptedValuesMap.furnaceExitTemperature,
        furnaceHeatBalance.calculatedFurnaceExitTemperature,
        THRESHOLD,
        2,
      );

      if (adjustAcceptedValue.changed) {
        acceptedValuesMap.furnaceExitTemperature = adjustAcceptedValue.value;
        needRecalculation = true;
        continue;
      }

      adjustAcceptedValue = this.adjustAcceptedValue(
        acceptedValuesMap.adiabaticCombustionTemperature,
        furnaceHeatBalance.calculatedAdiabaticCombustionTemperature,
        THRESHOLD,
        2,
      );

      if (adjustAcceptedValue.changed) {
        acceptedValuesMap.adiabaticCombustionTemperature =
          adjustAcceptedValue.value;
        needRecalculation = true;
        continue;
      }

      const firstConvectivePackageHeatBalance = this.calculateConvectivePackage(
        {
          number: 1,
          acceptedTemp: acceptedValuesMap.firstConvectivePackageExitTemperature,
          previousHeatBalance: furnaceHeatBalance,
          convectivePackages,
          airLeakage,
          boilerCharacteristics,
          heatBalance,
          airExcessCoefficients,
          combustionMaterialBalances,
        },
      );

      if (
        acceptedValuesMap.firstConvectivePackageExitTemperature -
          firstConvectivePackageHeatBalance.heatedMediumTemperature <=
        0
      ) {
        acceptedValuesMap.adiabaticCombustionTemperature =
          firstConvectivePackageHeatBalance.heatedMediumTemperature + 50;
        acceptedValuesMap.firstConvectivePackageExitTemperature =
          firstConvectivePackageHeatBalance.heatedMediumTemperature + 50;
        needRecalculation = true;
        continue;
      }

      adjustAcceptedValue = this.adjustAcceptedValue(
        acceptedValuesMap.firstConvectivePackageExitTemperature,
        firstConvectivePackageHeatBalance.calculatedPackageExitTemperature,
        THRESHOLD,
        20,
      );

      if (adjustAcceptedValue.changed) {
        acceptedValuesMap.firstConvectivePackageExitTemperature =
          adjustAcceptedValue.value;
        needRecalculation = true;
        continue;
      }

      const secondConvectivePackageHeatBalance =
        this.calculateConvectivePackage({
          number: 2,
          acceptedTemp:
            acceptedValuesMap.secondConvectivePackageExitTemperature,
          previousHeatBalance: firstConvectivePackageHeatBalance,
          convectivePackages,
          airLeakage,
          boilerCharacteristics,
          heatBalance,
          airExcessCoefficients,
          combustionMaterialBalances,
        });

      if (
        acceptedValuesMap.secondConvectivePackageExitTemperature -
          secondConvectivePackageHeatBalance.heatedMediumTemperature <=
        0
      ) {
        acceptedValuesMap.adiabaticCombustionTemperature =
          secondConvectivePackageHeatBalance.heatedMediumTemperature + 50;
        acceptedValuesMap.secondConvectivePackageExitTemperature =
          secondConvectivePackageHeatBalance.heatedMediumTemperature + 50;
        needRecalculation = true;
        continue;
      }

      adjustAcceptedValue = this.adjustAcceptedValue(
        acceptedValuesMap.secondConvectivePackageExitTemperature,
        secondConvectivePackageHeatBalance.calculatedPackageExitTemperature,
        THRESHOLD,
        20,
      );

      if (adjustAcceptedValue.changed) {
        acceptedValuesMap.secondConvectivePackageExitTemperature =
          adjustAcceptedValue.value;
        needRecalculation = true;
        continue;
      }

      const alphaEconomizer = this.getAlpha(
        'alphaEconomizer',
        airExcessCoefficients,
        combustionMaterialBalances,
      );

      const alphaEconomizerAvg = this.getAlpha(
        'alphaEconomizerAvg',
        airExcessCoefficients,
        combustionMaterialBalances,
      );

      const economizerHeatBalance =
        this.economizerHeatBalancesService.calculate({
          airLeakage,
          acceptedEconomizerExitTemperature:
            acceptedValuesMap.economizerExitTemperature,
          alphaEconomizerCombustionMaterialBalance: alphaEconomizer.balance,
          alphaEconomizerAvgCombustionMaterialBalance:
            alphaEconomizerAvg.balance,
          boilerCharacteristics,
          convectivePackageHeatBalance: secondConvectivePackageHeatBalance,
          economizerCharacteristic,
          fuelComposition,
          heatBalance,
          alphaFurnaceCombusitonMaterialBalance: alphaFurnace.balance,
        });

      adjustAcceptedValue = this.adjustAcceptedValue(
        acceptedValuesMap.economizerExitTemperature,
        economizerHeatBalance.calculatedEconomizerExitTemperature,
        THRESHOLD,
        10,
      );

      if (adjustAcceptedValue.changed) {
        acceptedValuesMap.economizerExitTemperature = adjustAcceptedValue.value;
        needRecalculation = true;
        continue;
      }

      result = {
        boilerCharacteristics,
        fuelComposition,
        furnaceCharacteristic,
        convectivePackages,
        airLeakage,
        temperatureCharacteristics,
        combustionMaterialBalanceTemperature,
        airExcessCoefficients,
        combustionMaterialBalances,
        heatBalance,
        furnaceHeatBalance,
        firstConvectivePackageHeatBalance,
        secondConvectivePackageHeatBalance,
        economizerCharacteristic,
        economizerHeatBalance,
      };
    }

    const converted = this.convertIntToFloat(result);
    this.logger.info({ ...converted, message: 'Calculation result' });
    return converted;
  }

  private adjustAcceptedValue(
    accepted: number,
    calculated: number,
    threshold: number,
    divisionPercent = 50,
  ) {
    const diff = Math.abs(accepted - calculated);

    if (diff < threshold) {
      return { value: accepted, changed: false };
    }

    const delta =
      divisionPercent === 2 ? diff / 2 : diff * 0.01 * divisionPercent;

    return {
      value: accepted < calculated ? accepted + delta : accepted - delta,
      changed: true,
    };
  }

  private getAlpha(
    name: string,
    airExcessCoefficients: AirExcessCoefficient[],
    combustionMaterialBalances: CombustionMaterialBalance[],
  ) {
    return {
      coefficient: airExcessCoefficients.find((a) => a.name === name),
      balance: combustionMaterialBalances.find(
        (b) => b.airExcessCoefficientName === name,
      ),
    };
  }

  private calculateConvectivePackage(params: {
    number: number;
    acceptedTemp: number;
    previousHeatBalance: any;
    convectivePackages: any[];
    airLeakage: any;
    boilerCharacteristics: any;
    heatBalance: any;
    airExcessCoefficients: any[];
    combustionMaterialBalances: any[];
  }) {
    const { number } = params;

    const alpha = this.getAlpha(
      `alphaConvectivePackage${number}`,
      params.airExcessCoefficients,
      params.combustionMaterialBalances,
    );

    const alphaAvg = this.getAlpha(
      `alphaConvectivePackage${number}Avg`,
      params.airExcessCoefficients,
      params.combustionMaterialBalances,
    );

    const previousExitTemp =
      params.previousHeatBalance.calculatedFurnaceExitTemperature ||
      params.previousHeatBalance.calculatedPackageExitTemperature;

    return this.convectivePackageHeatBalancesService.calculate({
      convecivePackageNumber: number,
      acceptedPackageExitTemperature: params.acceptedTemp,
      convectivePackageCharacteristics: params.convectivePackages.find(
        (p) => p.packageNumber === number,
      ),
      airLeakage: params.airLeakage,
      alphaConvectiveAvgCombustionMaterialBalance: alphaAvg.balance,
      alphaConvectivePackageCombustionMaterialBalance: alpha.balance,
      boilerCharacteristics: {
        excessPressureInBoiler:
          params.boilerCharacteristics.excessPressureInBoiler,
        flueGasAbsolutePressure:
          params.boilerCharacteristics.flueGasAbsolutePressure,
      },
      previousComponentHeatBalance: {
        calculatedExitTemperature: previousExitTemp,
        combustionProductEnthalpyExit:
          params.previousHeatBalance.combustionProductEnthalpyExit,
      },
      heatBalance: params.heatBalance,
    });
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
