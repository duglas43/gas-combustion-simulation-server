import { Injectable } from '@nestjs/common';
import { CreateCalculationDto } from './dto/create-calculation.dto';
import { EconomizerCharacteristicRepository } from 'src/economizer-characteristics/repositories';
import { EconomizerCharacteristicsService } from 'src/economizer-characteristics/economizer-characteristics.service';
import { BoilerCharacteristicRepository } from 'src/boiler-characteristics/repositories';
import { BoilerCharacteristicsService } from 'src/boiler-characteristics/boiler-characteristics.service';
import { FuelCompositionRepository } from 'src/fuel-compositions/repositories';
import { FuelCompositionsService } from 'src/fuel-compositions/fuel-compositions.service';
import { FurnaceCharacteristicsService } from 'src/furnace-characteristics/furnace-characteristics.service';
import { FurnaceCharacteristicRepository } from 'src/furnace-characteristics/repositories';
import { ConvectivePackagesService } from 'src/convective-packages/convective-packages.service';
import { ConvectivePackageRepository } from 'src/convective-packages/repositories';
import { AirLeakagesService } from 'src/air-leakages/air-leakages.service';
import { AirLeakageRepository } from 'src/air-leakages/repositories';
import { TemperatureCharacteristicsService } from 'src/temperature-characteristics/temparature-characteristics.service';
import { TemperatureCharacteristicRepository } from 'src/temperature-characteristics/repositories';
import { CombustionMaterialBalanceTemperatureRepository } from 'src/combustion-material-balance-temperatures/repositories';
import { CombustionMaterialBalanceTemperaturesService } from 'src/combustion-material-balance-temperatures/combustion-material-balance-temperatures.service';
import { AirExcessCoefficientRepository } from 'src/air-excess-coefficients/repositories';
import { AirExcessCoefficientsService } from 'src/air-excess-coefficients/air-excess-coefficients.service';
import { CombustionMaterialBalancesService } from 'src/combustion-material-balances/combustion-material-balances.service';
import { CombustionMaterialBalanceRepository } from 'src/combustion-material-balances/repositories';
import { HeatBalancesService } from 'src/heat-balances/heat-balances.service';
import { HeatBalanceRepository } from 'src/heat-balances/repositories';
import { FurnaceHeatBalancesService } from 'src/furnace-heat-balances/furnace-heat-balances.service';
import { FurnaceHeatBalanceRepository } from 'src/furnace-heat-balances/repositories';
import { ConvectivePackageHeatBalancesService } from 'src/convective-package-heat-balances/convective-package-heat-balances.service';
import { ConvectivePackageHeatBalanceRepository } from 'src/convective-package-heat-balances/repositories';
import { EconomizerHeatBalanceRepository } from 'src/economizer-heat-balances/repositories/economizer-heat-balance.repository';
import { EconomizerHeatBalancesService } from 'src/economizer-heat-balances/economizer-heat-balances.service';

@Injectable()
export class CalculationsService {
  constructor(
    private economizerCharacteristicRepository: EconomizerCharacteristicRepository,
    private boilerCharacteristicRepository: BoilerCharacteristicRepository,
    private boilerCharacteristicsService: BoilerCharacteristicsService,
    private fuelCompositionRepository: FuelCompositionRepository,
    private fuelCompositionsService: FuelCompositionsService,
    private furnaceCharacteristicsService: FurnaceCharacteristicsService,
    private furnaceCharacteristicRepository: FurnaceCharacteristicRepository,
    private convectivePackagesService: ConvectivePackagesService,
    private convectivePackageRepository: ConvectivePackageRepository,
    private airLeakagesService: AirLeakagesService,
    private airLeakageRepository: AirLeakageRepository,
    private temperatureCharacteristicsService: TemperatureCharacteristicsService,
    private temperatureCharacteristicRepository: TemperatureCharacteristicRepository,
    private combustionMaterialBalanceTemperatureRepository: CombustionMaterialBalanceTemperatureRepository,
    private combustionMaterialBalanceTemperaturesService: CombustionMaterialBalanceTemperaturesService,
    private airExcessCoefficientRepository: AirExcessCoefficientRepository,
    private airExcessCoefficientsService: AirExcessCoefficientsService,
    private combustionMaterialBalancesService: CombustionMaterialBalancesService,
    private combustionMaterialBalanceRepository: CombustionMaterialBalanceRepository,
    private heatBalancesService: HeatBalancesService,
    private heatBalanceRepository: HeatBalanceRepository,
    private furnaceHeatBalancesService: FurnaceHeatBalancesService,
    private furnaceHeatBalanceRepository: FurnaceHeatBalanceRepository,
    private convectivePackageHeatBalancesService: ConvectivePackageHeatBalancesService,
    private convectivePackageHeatBalanceRepository: ConvectivePackageHeatBalanceRepository,
    private economizerCharacteristicsService: EconomizerCharacteristicsService,
    private economizerHeatBalanceRepository: EconomizerHeatBalanceRepository,
    private economizerHeatBalancesService: EconomizerHeatBalancesService,
  ) {}

  async create(dto: CreateCalculationDto) {
    await this.airLeakageRepository.delete({});
    await this.airExcessCoefficientRepository.delete({});
    await this.boilerCharacteristicRepository.delete({});
    await this.combustionMaterialBalanceRepository.delete({});
    await this.combustionMaterialBalanceTemperatureRepository.delete({});
    await this.convectivePackageRepository.delete({});
    await this.convectivePackageHeatBalanceRepository.delete({});
    await this.economizerHeatBalanceRepository.delete({});
    await this.fuelCompositionRepository.delete({});
    await this.furnaceCharacteristicRepository.delete({});
    await this.furnaceHeatBalanceRepository.delete({});
    await this.heatBalanceRepository.delete({});
    await this.temperatureCharacteristicRepository.delete({});
    await this.economizerCharacteristicRepository.delete({});

    const economizerCharacteristic =
      await this.economizerCharacteristicsService.calculate();
    await this.economizerCharacteristicRepository.save(
      economizerCharacteristic,
    );

    const boilerCharacteristic =
      await this.boilerCharacteristicsService.calculate(
        dto.boilerCharacteristics,
      );
    await this.boilerCharacteristicRepository.save(boilerCharacteristic);

    const fuelComposition = await this.fuelCompositionsService.calculate({
      createFuelCompositionDto: dto.fuelComposition,
      boilerCharacreristics: {
        gasInletTemperature: boilerCharacteristic.gasInletTemperature,
      },
    });
    await this.fuelCompositionRepository.save(fuelComposition);

    const furnaceCharacteristic =
      await this.furnaceCharacteristicsService.calculate({
        createFurnaceCharacteristicDto: dto.furnaceCharacteristics,
      });
    await this.furnaceCharacteristicRepository.save(furnaceCharacteristic);

    const convectivePackages = await this.convectivePackagesService.calculate({
      createConvectivePackageDtos: dto.convectivePackagesParameters,
    });
    await this.convectivePackageRepository.save(convectivePackages);

    const airLeakage = await this.airLeakagesService.calculate({
      boilerCharacreristics: {
        actualSteamProduction: boilerCharacteristic.actualSteamProduction,
        nominalSteamProduction: boilerCharacteristic.nominalSteamProduction,
      },
    });
    await this.airLeakageRepository.save(airLeakage);

    const temperatureCharacteristic =
      await this.temperatureCharacteristicsService.calculate({
        boilerCharacteristics: {
          roomAirTemperature: boilerCharacteristic.roomAirTemperature,
        },
        fuelComposition,
      });
    await this.temperatureCharacteristicRepository.save(
      temperatureCharacteristic,
    );

    const combustionMaterialBalanceTemperature =
      await this.combustionMaterialBalanceTemperaturesService.calculate({
        fuelComposition,
        boilerCharacteristics: {
          airHumidityForCombustion:
            boilerCharacteristic.airHumidityForCombustion,
        },
      });
    await this.combustionMaterialBalanceTemperatureRepository.save(
      combustionMaterialBalanceTemperature,
    );

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
    await this.airExcessCoefficientRepository.save(airExcessCoefficients);

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
    await this.combustionMaterialBalanceRepository.save(
      combustionMaterialBalances,
    );
    const alphaFlueGasCoefficient = airExcessCoefficients.find(
      (airExcessCoefficient) => airExcessCoefficient.name === 'alphaFlueGas',
    );
    const alphaFlueGasCombustionMaterialBalance =
      combustionMaterialBalances.find(
        (combustionMaterialBalance) =>
          combustionMaterialBalance.airExcessCoefficientId ===
          alphaFlueGasCoefficient.id,
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
    await this.heatBalanceRepository.save(heatBalance);

    const alphaBurnerCoefficient = airExcessCoefficients.find(
      (airExcessCoefficient) => airExcessCoefficient.name === 'alphaBurner',
    );
    const alphaFurnaceAvgCoefficient = airExcessCoefficients.find(
      (airExcessCoefficient) => airExcessCoefficient.name === 'alphaFurnaceAvg',
    );
    const alphaBurnerCombustionMaterialBalance =
      combustionMaterialBalances.find(
        (combustionMaterialBalance) =>
          combustionMaterialBalance.airExcessCoefficientId ===
          alphaBurnerCoefficient.id,
      );
    const alphaFurnaceAvgCombustionMaterialBalance =
      combustionMaterialBalances.find(
        (combustionMaterialBalance) =>
          combustionMaterialBalance.airExcessCoefficientId ===
          alphaFurnaceAvgCoefficient.id,
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
    await this.furnaceHeatBalanceRepository.save(furnaceHeatBalance);

    const alphaConvectiveAvgCoefficient = airExcessCoefficients.find(
      (airExcessCoefficient) =>
        airExcessCoefficient.name === 'alphaConvectiveAvg',
    );
    const alphaConvectivePackageCoefficient = airExcessCoefficients.find(
      (airExcessCoefficient) =>
        airExcessCoefficient.name === 'alphaConvectivePackage',
    );
    const alphaConvectiveAvgCombustionMaterialBalance =
      combustionMaterialBalances.find(
        (combustionMaterialBalance) =>
          combustionMaterialBalance.airExcessCoefficientId ===
          alphaConvectiveAvgCoefficient.id,
      );
    const alphaConvectivePackageCombustionMaterialBalance =
      combustionMaterialBalances.find(
        (combustionMaterialBalance) =>
          combustionMaterialBalance.airExcessCoefficientId ===
          alphaConvectivePackageCoefficient.id,
      );

    const firstConvectivePackageHeatBalance =
      await this.convectivePackageHeatBalancesService.calculate({
        convecivePackageNumber: 1,
        convectivePackageCharacteristics: convectivePackages.find(
          (cp) => cp.packageNumber === 1,
        ),
        airLeakage,
        alphaConvectiveAvgCombustionMaterialBalance,
        alphaConvectivePackageCombustionMaterialBalance,
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
        alphaConvectiveAvgCombustionMaterialBalance,
        alphaConvectivePackageCombustionMaterialBalance,
        boilerCharacteristics: {
          excessPressureInBoiler: boilerCharacteristic.excessPressureInBoiler,
          flueGasAbsolutePressure: boilerCharacteristic.flueGasAbsolutePressure,
        },
        furnaceHeatBalance,
        heatBalance,
      });

    await this.convectivePackageHeatBalanceRepository.save(
      firstConvectivePackageHeatBalance,
    );
    await this.convectivePackageHeatBalanceRepository.save(
      secondConvectivePackageHeatBalance,
    );

    const alphaEconomizerCoefficient = airExcessCoefficients.find(
      (airExcessCoefficient) => airExcessCoefficient.name === 'alphaEconomizer',
    );
    const alphaEconomizerCombustionMaterialBalance =
      combustionMaterialBalances.find(
        (combustionMaterialBalance) =>
          combustionMaterialBalance.airExcessCoefficientId ===
          alphaEconomizerCoefficient.id,
      );
    const alphaFurnaceCoefficient = airExcessCoefficients.find(
      (airExcessCoefficient) => airExcessCoefficient.name === 'alphaFurnace',
    );
    const alphaFurnaceCombusitonMaterialBalance =
      combustionMaterialBalances.find(
        (combustionMaterialBalance) =>
          combustionMaterialBalance.airExcessCoefficientId ===
          alphaFurnaceCoefficient.id,
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

    await this.economizerHeatBalanceRepository.save(economizerHeatBalance);
    return 'Ok';
  }
}
