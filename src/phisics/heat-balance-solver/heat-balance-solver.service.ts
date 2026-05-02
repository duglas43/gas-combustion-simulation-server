import { Injectable } from '@nestjs/common';
import { AirLeakagesService } from 'src/phisics/air-leakages/air-leakages.service';
import { TemperatureCharacteristicsService } from 'src/phisics/temperature-characteristics/temparature-characteristics.service';
import { CombustionMaterialBalanceTemperaturesService } from 'src/phisics/combustion-material-balance-temperatures/combustion-material-balance-temperatures.service';
import { AirExcessCoefficientsService } from 'src/phisics/air-excess-coefficients/air-excess-coefficients.service';
import { CombustionMaterialBalancesService } from 'src/phisics/combustion-material-balances/combustion-material-balances.service';
import { HeatBalancesService } from 'src/phisics/heat-balances/heat-balances.service';
import { FurnaceHeatBalancesService } from 'src/phisics/furnace-heat-balances/furnace-heat-balances.service';
import { ConvectivePackageHeatBalancesService } from 'src/phisics/convective-package-heat-balances/convective-package-heat-balances.service';
import { EconomizerHeatBalancesService } from 'src/phisics/economizer-heat-balances/economizer-heat-balances.service';
import { AirExcessCoefficient } from 'src/phisics/air-excess-coefficients/entities';
import { CombustionMaterialBalance } from 'src/phisics/combustion-material-balances/entities';
import { Observation } from 'src/observations/entities';
import { SolverResultToObservationMapper } from './mappers';
import { SolverOptions, SolverResult } from './interfaces';
import { State } from 'src/state/entities';

@Injectable()
export class HeatBalanceSolverService {
  constructor(
    private readonly airLeakagesService: AirLeakagesService,
    private readonly temperatureCharacteristicsService: TemperatureCharacteristicsService,
    private readonly combustionMaterialBalanceTemperaturesService: CombustionMaterialBalanceTemperaturesService,
    private readonly airExcessCoefficientsService: AirExcessCoefficientsService,
    private readonly combustionMaterialBalancesService: CombustionMaterialBalancesService,
    private readonly heatBalancesService: HeatBalancesService,
    private readonly furnaceHeatBalancesService: FurnaceHeatBalancesService,
    private readonly convectivePackageHeatBalancesService: ConvectivePackageHeatBalancesService,
    private readonly economizerHeatBalancesService: EconomizerHeatBalancesService,
    private readonly solverResultToObservationMapper: SolverResultToObservationMapper,
  ) {}

  solveStep(
    previousObservation: Observation,
    state: State,
    options: SolverOptions = {
      maxInternalIterations: 2,
      threshold: 0.1,
    },
  ): Observation {
    const acceptedValuesMap = {
      adiabaticCombustionTemperature:
        previousObservation.adiabaticCombustionTemperature,
      furnaceExitTemperature: previousObservation.furnaceExitTemperature,
      firstConvectivePackageExitTemperature:
        previousObservation.firstConvectivePackageExitTemperature,
      secondConvectivePackageExitTemperature:
        previousObservation.secondConvectivePackageExitTemperature,
      economizerExitTemperature: previousObservation.economizerExitTemperature,
    };

    let needRecalculation = true;
    let result: SolverResult;

    for (
      let i = 0;
      i < options.maxInternalIterations && needRecalculation;
      i++
    ) {
      needRecalculation = false;

      const airLeakage = this.airLeakagesService.calculate({
        boilerCharacreristics: {
          actualSteamProduction:
            state.boilerCharacteristics.actualSteamProduction,
          nominalSteamProduction:
            state.boilerCharacteristics.nominalSteamProduction,
        },
      });

      const temperatureCharacteristics =
        this.temperatureCharacteristicsService.calculate({
          boilerCharacteristics: {
            roomAirTemperature: state.boilerCharacteristics.roomAirTemperature,
          },
          fuelComposition: state.fuelComposition,
        });

      const combustionMaterialBalanceTemperature =
        this.combustionMaterialBalanceTemperaturesService.calculate({
          fuelComposition: state.fuelComposition,
          boilerCharacteristics: {
            airHumidityForCombustion:
              state.boilerCharacteristics.airHumidityForCombustion,
          },
        });

      const airExcessCoefficients = this.airExcessCoefficientsService.calculate(
        {
          airLeakage,
          boilerCharacteristic: {
            excessAirCoefficient:
              state.boilerCharacteristics.excessAirCoefficient,
          },
        },
      );

      const combustionMaterialBalances =
        this.combustionMaterialBalancesService.calculate({
          airExcessCoefficients,
          boilerCharacteristics: {
            airHumidityForCombustion:
              state.boilerCharacteristics.airHumidityForCombustion,
            gasHumidityForCombustion:
              state.boilerCharacteristics.gasHumidityForCombustion,
            flueGasAbsolutePressure:
              state.boilerCharacteristics.flueGasAbsolutePressure,
          },
          combustionMaterialBalanceTemperature,
          fuelComposition: state.fuelComposition,
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
        boilerCharacteristics: state.boilerCharacteristics,
        combustionMaterialBalanceTemperature,
        fuelComposition: state.fuelComposition,
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
            state.boilerCharacteristics.flueGasAbsolutePressure,
        },
        combustionMaterialBalanceTemperature,
        fuelComposition: state.fuelComposition,
        furnaceCharacteristic: state.furnaceCharacteristics,
        heatBalance,
        alphaFlueGasCoefficient: alphaFlueGas.coefficient.value,
        temperatureCharacteristics,
      });

      let adjustAcceptedValue = this.adjustAcceptedValue(
        acceptedValuesMap.furnaceExitTemperature,
        furnaceHeatBalance.calculatedFurnaceExitTemperature,
        options.threshold,
        2,
      );

      if (adjustAcceptedValue.changed) {
        acceptedValuesMap.furnaceExitTemperature = adjustAcceptedValue.value;
        needRecalculation = true;
      }

      adjustAcceptedValue = this.adjustAcceptedValue(
        acceptedValuesMap.adiabaticCombustionTemperature,
        furnaceHeatBalance.calculatedAdiabaticCombustionTemperature,
        options.threshold,
        2,
      );

      if (adjustAcceptedValue.changed) {
        acceptedValuesMap.adiabaticCombustionTemperature =
          adjustAcceptedValue.value;
        needRecalculation = true;
      }

      const firstConvectivePackageHeatBalance = this.calculateConvectivePackage(
        {
          number: 1,
          acceptedTemp: acceptedValuesMap.firstConvectivePackageExitTemperature,
          previousHeatBalance: furnaceHeatBalance,
          convectivePackages: state.convectivePackagesParameters,
          airLeakage,
          boilerCharacteristics: state.boilerCharacteristics,
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
      }

      adjustAcceptedValue = this.adjustAcceptedValue(
        acceptedValuesMap.firstConvectivePackageExitTemperature,
        firstConvectivePackageHeatBalance.calculatedPackageExitTemperature,
        options.threshold,
        20,
      );

      if (adjustAcceptedValue.changed) {
        acceptedValuesMap.firstConvectivePackageExitTemperature =
          adjustAcceptedValue.value;
        needRecalculation = true;
      }

      const secondConvectivePackageHeatBalance =
        this.calculateConvectivePackage({
          number: 2,
          acceptedTemp:
            acceptedValuesMap.secondConvectivePackageExitTemperature,
          previousHeatBalance: firstConvectivePackageHeatBalance,
          convectivePackages: state.convectivePackagesParameters,
          airLeakage,
          boilerCharacteristics: state.boilerCharacteristics,
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
      }

      adjustAcceptedValue = this.adjustAcceptedValue(
        acceptedValuesMap.secondConvectivePackageExitTemperature,
        secondConvectivePackageHeatBalance.calculatedPackageExitTemperature,
        options.threshold,
        20,
      );

      if (adjustAcceptedValue.changed) {
        acceptedValuesMap.secondConvectivePackageExitTemperature =
          adjustAcceptedValue.value;
        needRecalculation = true;
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
          boilerCharacteristics: state.boilerCharacteristics,
          convectivePackageHeatBalance: secondConvectivePackageHeatBalance,
          economizerCharacteristic: state.economizerCharacteristic,
          fuelComposition: state.fuelComposition,
          heatBalance,
          alphaFurnaceCombusitonMaterialBalance: alphaFurnace.balance,
        });

      adjustAcceptedValue = this.adjustAcceptedValue(
        acceptedValuesMap.economizerExitTemperature,
        economizerHeatBalance.calculatedEconomizerExitTemperature,
        options.threshold,
        10,
      );

      if (adjustAcceptedValue.changed) {
        acceptedValuesMap.economizerExitTemperature = adjustAcceptedValue.value;
        needRecalculation = true;
      }

      result = {
        airLeakage,
        temperatureCharacteristics,
        combustionMaterialBalanceTemperature,
        airExcessCoefficients,
        combustionMaterialBalances,
        heatBalance,
        furnaceHeatBalance,
        firstConvectivePackageHeatBalance,
        secondConvectivePackageHeatBalance,
        economizerHeatBalance,
      };
    }

    const newObservation = this.solverResultToObservationMapper.map(
      this.convertIntToFloat(result),
    );
    return newObservation;
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

  private convertIntToFloat<T>(obj: T): T {
    const result: any = {};

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
