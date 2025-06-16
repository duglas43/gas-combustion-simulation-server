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
import { BoilerCharacteristic } from 'src/boiler-characteristics/entities';

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
    const economizerCharacteristic =
      await this.economizerCharacteristicsService.calculate();

    const boilerCharacteristic =
      await this.boilerCharacteristicsService.calculate(
        dto.boilerCharacteristics,
      );

    const fuelComposition = await this.fuelCompositionsService.calculate({
      createFuelCompositionDto: dto.fuelComposition,
      boilerCharacreristics: {
        gasInletTemperature: boilerCharacteristic.gasInletTemperature,
      },
    });

    const furnaceCharacteristic =
      await this.furnaceCharacteristicsService.calculate({
        createFurnaceCharacteristicDto: dto.furnaceCharacteristics,
      });

    const convectivePackages = await this.convectivePackagesService.calculate({
      createConvectivePackageDtos: dto.convectivePackagesParameters,
    });

    const airLeakage = await this.airLeakagesService.calculate({
      boilerCharacreristics: {
        actualSteamProduction: boilerCharacteristic.actualSteamProduction,
        nominalSteamProduction: boilerCharacteristic.nominalSteamProduction,
      },
    });

    const temperatureCharacteristic =
      await this.temperatureCharacteristicsService.calculate({
        boilerCharacteristics: {
          roomAirTemperature: boilerCharacteristic.roomAirTemperature,
        },
        fuelComposition,
      });

    const combustionMaterialBalanceTemperature =
      await this.combustionMaterialBalanceTemperaturesService.calculate({
        fuelComposition,
        boilerCharacteristics: {
          airHumidityForCombustion:
            boilerCharacteristic.airHumidityForCombustion,
        },
      });
    const airExcessCoefficients =
      await this.airExcessCoefficientsService.calculate({
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
    const combustionMaterialBalances =
      await this.combustionMaterialBalancesService.calculate({
        airExcessCoefficients,
        boilerCharacteristics: {
          airHumidityForCombustion:
            boilerCharacteristic.airHumidityForCombustion,
          gasHumidityForCombustion:
            boilerCharacteristic.gasHumidityForCombustion,
          flueGasAbsolutePressure: boilerCharacteristic.flueGasAbsolutePressure,
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
          combustionMaterialBalance.airExcessCoefficientName === 'alphaFlueGas',
      );

    const heatBalance = await this.heatBalancesService.calculate({
      alphaFlueGasCoefficient: alphaFlueGasCoefficient.value,
      alphaFlueGasCombustionMaterialBalance,
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

    const alphaBurnerCoefficient = airExcessCoefficients.find(
      (airExcessCoefficient) => airExcessCoefficient.name === 'alphaBurner',
    );
    const alphaFurnaceAvgCoefficient = airExcessCoefficients.find(
      (airExcessCoefficient) => airExcessCoefficient.name === 'alphaFurnaceAvg',
    );
    const alphaBurnerCombustionMaterialBalance =
      combustionMaterialBalances.find(
        (combustionMaterialBalance) =>
          combustionMaterialBalance.airExcessCoefficientName ===
          alphaBurnerCoefficient.name,
      );
    const alphaFurnaceAvgCombustionMaterialBalance =
      combustionMaterialBalances.find(
        (combustionMaterialBalance) =>
          combustionMaterialBalance.airExcessCoefficientName ===
          alphaFurnaceAvgCoefficient.name,
      );

    const furnaceHeatBalance = await this.furnaceHeatBalancesService.calculate({
      airLeakage,
      alphaBurnerCoefficient: alphaBurnerCoefficient.value,
      alphaBurnerCombustionMaterialBalance,
      alphaFurnaceAvgCombustionMaterialBalance,
      boilerCharacteristics: {
        flueGasAbsolutePressure: boilerCharacteristic.flueGasAbsolutePressure,
      },
      combustionMaterialBalanceTemperature,
      fuelComposition,
      furnaceCharacteristic,
      heatBalance,
      temperatureCharacteristic,
    });

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
    const secondAlphaConvectivePackageCoefficient = airExcessCoefficients.find(
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

    const firstConvectivePackageHeatBalance =
      await this.convectivePackageHeatBalancesService.calculate({
        convecivePackageNumber: 1,
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
          flueGasAbsolutePressure: boilerCharacteristic.flueGasAbsolutePressure,
        },
        furnaceHeatBalance,
        heatBalance,
      });
    const secondConvectivePackageHeatBalance =
      await this.convectivePackageHeatBalancesService.calculate({
        convecivePackageNumber: 2,
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
          flueGasAbsolutePressure: boilerCharacteristic.flueGasAbsolutePressure,
        },
        furnaceHeatBalance,
        heatBalance,
      });

    const alphaEconomizerCoefficient = airExcessCoefficients.find(
      (airExcessCoefficient) => airExcessCoefficient.name === 'alphaEconomizer',
    );
    const alphaEconomizerCombustionMaterialBalance =
      combustionMaterialBalances.find(
        (combustionMaterialBalance) =>
          combustionMaterialBalance.airExcessCoefficientName ===
          alphaEconomizerCoefficient.name,
      );
    const alphaFurnaceCoefficient = airExcessCoefficients.find(
      (airExcessCoefficient) => airExcessCoefficient.name === 'alphaFurnace',
    );
    const alphaFurnaceCombusitonMaterialBalance =
      combustionMaterialBalances.find(
        (combustionMaterialBalance) =>
          combustionMaterialBalance.airExcessCoefficientName ===
          alphaFurnaceCoefficient.name,
      );

    const economizerHeatBalance =
      await this.economizerHeatBalancesService.calculate({
        airLeakage,
        alphaEconomizerCombustionMaterialBalance,
        alphaFurnaceCombusitonMaterialBalance,
        boilerCharacteristic,
        convectivePackageHeatBalance: secondConvectivePackageHeatBalance,
        economizerCharacteristic,
        fuelComposition,
        heatBalance,
      });

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
      result,
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
