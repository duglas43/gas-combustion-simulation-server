import { Injectable } from '@nestjs/common';
import { CreateCalculationDto } from './dto/create-calculation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EconomizerHeatBalance } from './entity/economizer-heat-balance.entity';
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
import { Repository } from 'typeorm';
import { FurnaceHeatBalanceRepository } from 'src/furnace-heat-balances/repositories';
import { ConvectivePackageHeatBalancesService } from 'src/convective-package-heat-balances/convective-package-heat-balances.service';
import { ConvectivePackageHeatBalanceRepository } from 'src/convective-package-heat-balances/repositories';

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
    @InjectRepository(EconomizerHeatBalance)
    private economizerHeatBalanceRepository: Repository<EconomizerHeatBalance>,
    private economizerCharacteristicsService: EconomizerCharacteristicsService,
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
    const alphaFurnaceCoefficient = airExcessCoefficients.find(
      (airExcessCoefficient) => airExcessCoefficient.name === 'alphaFurnace',
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
          alphaFurnaceCoefficient.id,
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

    await this.createEconomizerHeatBalance();
    return 'Ok';
  }

  async createEconomizerHeatBalance() {
    const economizerCharacteristics =
      await this.economizerCharacteristicRepository.find({
        order: { createdAt: 'DESC' },
        take: 1,
      });

    const alphaEconomizerCombustionMaterialBalance =
      await this.combustionMaterialBalanceRepository.find({
        where: {
          airExcessCoefficient: { name: 'alphaEconomizer' },
        },
        relations: ['airExcessCoefficient'],
        order: { createdAt: 'DESC' },
        take: 1,
      });
    const heatBalances = await this.heatBalanceRepository.find({
      order: { createdAt: 'DESC' },
      take: 1,
    });
    const secondConvectivePackageHeatBalances =
      await this.convectivePackageHeatBalanceRepository.find({
        where: { convectivePackageId: 2 },
        order: { createdAt: 'DESC' },
        take: 1,
      });
    const airLeakages = await this.airLeakageRepository.find({
      order: { createdAt: 'DESC' },
      take: 1,
    });
    const boilerCharacteristic = await this.boilerCharacteristicRepository.find(
      {
        order: { createdAt: 'DESC' },
        take: 1,
      },
    );
    const alphaFurnaceCombusitonMaterialBalance =
      await this.combustionMaterialBalanceRepository.find({
        where: {
          airExcessCoefficient: { name: 'alphaFurnace' },
        },
        relations: ['airExcessCoefficient'],
        order: { createdAt: 'DESC' },
        take: 1,
      });

    const lastBoilerCharacteristic = boilerCharacteristic[0];
    const lastAirLeakage = airLeakages[0];
    const lastHeatBalance = heatBalances[0];
    const lastEconomizerCharacteristics = economizerCharacteristics[0];
    const lastAlphaEconomizerCombustionMaterialBalance =
      alphaEconomizerCombustionMaterialBalance[0];
    const lastSecondConvectivePackageHeatBalance =
      secondConvectivePackageHeatBalances[0];
    const lastFurnaceCombustionMaterialBalance =
      alphaFurnaceCombusitonMaterialBalance[0];
    const geometricAdjustmentFactor = 1;
    const heatEfficiencyCoefficient = 0.5;
    const heatUtilizationCoefficient = 0.8;
    const economizerExitTemperature = 153.3;
    const combustionProductEnthalpyExit =
      (lastAlphaEconomizerCombustionMaterialBalance.theoreticalCO2Volume *
        (1.604309582 +
          0.001133138 * economizerExitTemperature +
          -0.000000860416 * economizerExitTemperature ** 2 +
          0.000000000468441 * economizerExitTemperature ** 3 +
          -1.44713e-13 * economizerExitTemperature ** 4 +
          1.822707e-17 * economizerExitTemperature ** 5) +
        lastAlphaEconomizerCombustionMaterialBalance.theoreticalSO2Volume *
          (0.607026715343734 +
            3.08631797297832e-4 * economizerExitTemperature +
            -1.59369965554858e-7 * economizerExitTemperature ** 2 +
            1.63637023130679e-11 * economizerExitTemperature ** 3 +
            1.25572787709454e-14 * economizerExitTemperature ** 4 +
            -3.03012265579358e-18 * economizerExitTemperature ** 5) +
        lastAlphaEconomizerCombustionMaterialBalance.theoreticalWaterVaporVolume *
          (1.498317949 +
            0.000102932 * economizerExitTemperature +
            0.000000244654 * economizerExitTemperature ** 2 +
            -0.000000000156126 * economizerExitTemperature ** 3 +
            4.36681e-14 * economizerExitTemperature ** 4 +
            -5.05709e-18 * economizerExitTemperature ** 5) +
        lastAlphaEconomizerCombustionMaterialBalance.theoreticalNitrogenVolume *
          (1.29747332 +
            -0.000010563 * economizerExitTemperature +
            0.00000024181 * economizerExitTemperature ** 2 +
            -0.000000000183389 * economizerExitTemperature ** 3 +
            5.85924e-14 * economizerExitTemperature ** 4 +
            -7.03381e-18 * economizerExitTemperature ** 5) +
        lastAlphaEconomizerCombustionMaterialBalance.theoreticalOxygenVolume *
          (1.306450711 +
            0.000150251 * economizerExitTemperature +
            0.000000172284 * economizerExitTemperature ** 2 +
            -0.000000000232114 * economizerExitTemperature ** 3 +
            1.01527e-13 * economizerExitTemperature ** 4 +
            -1.53025e-17 * economizerExitTemperature ** 5)) *
      economizerExitTemperature;
    const economizerHeatAbsorption =
      lastHeatBalance.heatRetentionCoefficient *
      (lastSecondConvectivePackageHeatBalance.combustionProductEnthalpyExit -
        combustionProductEnthalpyExit +
        lastAirLeakage.actualEconomizerAirLeakage *
          lastHeatBalance.surroundingAirEnthalpy);

    const maxHeatedMediumTemperature =
      14.46082904 +
      391.6643525 *
        (lastBoilerCharacteristic.excessPressureInBoiler + 0.1) ** 0.5 +
      -515.7573764 * (lastBoilerCharacteristic.excessPressureInBoiler + 0.1) +
      467.8491656 *
        (lastBoilerCharacteristic.excessPressureInBoiler + 0.1) ** 1.5 +
      -218.8244345 *
        (lastBoilerCharacteristic.excessPressureInBoiler + 0.1) ** 2 +
      40.22947721 *
        (lastBoilerCharacteristic.excessPressureInBoiler + 0.1) ** 2.5 -
      20;
    const averageHeatedMediumTemperature =
      (lastBoilerCharacteristic.feedWaterTemperature +
        maxHeatedMediumTemperature) /
      2;
    const enthalpyIncrease =
      (economizerHeatAbsorption *
        lastHeatBalance.calculatedHourlyFuelConsumption) /
      lastHeatBalance.heatedHeatCarrierFlow;

    const heatedMediumExitTemperature =
      enthalpyIncrease / 4.2 + lastBoilerCharacteristic.feedWaterTemperature;

    const averageHeatedMediumExitTemperature =
      (lastBoilerCharacteristic.feedWaterTemperature +
        heatedMediumExitTemperature) /
      2;

    const logarithmicTemperatureDifference =
      ((lastSecondConvectivePackageHeatBalance.packageExitTemperature -
        economizerExitTemperature -
        (economizerExitTemperature -
          lastBoilerCharacteristic.feedWaterTemperature)) *
        geometricAdjustmentFactor) /
      Math.log(
        (lastSecondConvectivePackageHeatBalance.packageExitTemperature -
          economizerExitTemperature) /
          (economizerExitTemperature -
            lastBoilerCharacteristic.feedWaterTemperature),
      );

    const averageCombustionTemperature =
      (lastSecondConvectivePackageHeatBalance.packageExitTemperature +
        economizerExitTemperature) /
      2;
    const averageCombustionVelocity =
      (lastHeatBalance.calculatedHourlyFuelConsumption *
        lastFurnaceCombustionMaterialBalance.totalWetCombustionProductsVolume *
        (averageCombustionTemperature + 273.15)) /
      (3600 * lastEconomizerCharacteristics.channelCrossSectionArea * 273.15);

    const reynoldsCriterion =
      (averageCombustionVelocity *
        lastEconomizerCharacteristics.equivalentChannelDiameter) /
      (0.0000119686 +
        0.0000000793511 * averageCombustionTemperature +
        9.50931e-11 * averageCombustionTemperature ** 2 +
        -1.8727e-14 * averageCombustionTemperature ** 3 +
        -2.98081e-18 * averageCombustionTemperature ** 4 +
        2.03358e-21 * averageCombustionTemperature ** 5);

    const prandtlCriterion =
      0.738992754 +
      -0.000431304 * averageCombustionTemperature +
      0.000000571399 * averageCombustionTemperature ** 2 +
      -0.000000000435355 * averageCombustionTemperature ** 3 +
      1.525e-13 * averageCombustionTemperature ** 4 +
      -1.98029e-17 * averageCombustionTemperature ** 5;
    const finningCoefficient =
      (2 *
        ((lastEconomizerCharacteristics.finSize * 0.001) ** 2 -
          0.785 *
            (lastEconomizerCharacteristics.outerCasingTubeDiameter * 0.001) **
              2 +
          2 *
            lastEconomizerCharacteristics.finSize *
            0.001 *
            lastEconomizerCharacteristics.finThickness *
            0.001)) /
        (3.14159 *
          lastEconomizerCharacteristics.outerCasingTubeDiameter *
          0.001 *
          lastEconomizerCharacteristics.finPitch *
          0.001) -
      lastEconomizerCharacteristics.finThickness /
        lastEconomizerCharacteristics.finPitch +
      1;

    const parameterPhi = Math.tanh(
      4 *
        (finningCoefficient / 7 +
          2 -
          lastEconomizerCharacteristics.relativeRowPitch),
    );

    const correctionCoefficientCs =
      (1.36 - parameterPhi) * (11 / (parameterPhi + 8) - 0.14);

    const correctionCoefficientCz = 1;

    const convectiveHeatTransferCoefficient =
      ((0.113 *
        (0.081620792 +
          0.000316982 * averageCombustionTemperature +
          -0.000000020208 * averageCombustionTemperature ** 2 +
          7.29755e-12 * averageCombustionTemperature ** 3 +
          8.71812e-15 * averageCombustionTemperature ** 4 +
          -3.60461e-18 * averageCombustionTemperature ** 5)) /
        (lastEconomizerCharacteristics.outerCasingTubeDiameter * 0.001)) *
      reynoldsCriterion **
        (0.7 + 0.08 * parameterPhi + 0.005 * finningCoefficient) *
      prandtlCriterion ** 0.33 *
      correctionCoefficientCs *
      correctionCoefficientCz;

    const heatTransferCoefficient =
      heatEfficiencyCoefficient *
      heatUtilizationCoefficient *
      convectiveHeatTransferCoefficient;

    const heatTransferByEquation =
      (heatTransferCoefficient *
        lastEconomizerCharacteristics.totalHeatTransferSurfaceArea *
        logarithmicTemperatureDifference) /
      lastHeatBalance.calculatedHourlyFuelConsumption;

    const controlExitTemperature =
      (lastSecondConvectivePackageHeatBalance.combustionProductEnthalpyExit -
        heatTransferByEquation / lastHeatBalance.heatRetentionCoefficient +
        lastAirLeakage.actualEconomizerAirLeakage *
          lastHeatBalance.surroundingAirEnthalpy) /
      (lastAlphaEconomizerCombustionMaterialBalance.theoreticalCO2Volume *
        (1.604309582 +
          0.001133138 * economizerExitTemperature -
          0.000000860416 * economizerExitTemperature ** 2 +
          0.000000000468441 * economizerExitTemperature ** 3 -
          1.44713e-13 * economizerExitTemperature ** 4 +
          1.822707e-17 * economizerExitTemperature ** 5) +
        lastAlphaEconomizerCombustionMaterialBalance.theoreticalSO2Volume *
          (0.607026715343734 +
            3.08631797297832e-4 * economizerExitTemperature -
            1.59369965554858e-7 * economizerExitTemperature ** 2 +
            1.63637023130679e-11 * economizerExitTemperature ** 3 +
            1.25572787709454e-14 * economizerExitTemperature ** 4 -
            3.03012265579358e-18 * economizerExitTemperature ** 5) +
        lastAlphaEconomizerCombustionMaterialBalance.theoreticalWaterVaporVolume *
          (1.498317949 +
            0.000102932 * economizerExitTemperature +
            0.000000244654 * economizerExitTemperature ** 2 -
            0.000000000156126 * economizerExitTemperature ** 3 +
            4.36681e-14 * economizerExitTemperature ** 4 -
            5.05709e-18 * economizerExitTemperature ** 5) +
        lastAlphaEconomizerCombustionMaterialBalance.theoreticalNitrogenVolume *
          (1.29747332 -
            0.000010563 * economizerExitTemperature +
            0.00000024181 * economizerExitTemperature ** 2 -
            0.000000000183389 * economizerExitTemperature ** 3 +
            5.85924e-14 * economizerExitTemperature ** 4 -
            7.03381e-18 * economizerExitTemperature ** 5) +
        lastAlphaEconomizerCombustionMaterialBalance.theoreticalOxygenVolume *
          (1.306450711 +
            0.000150251 * economizerExitTemperature +
            0.000000172284 * economizerExitTemperature ** 2 -
            0.000000000232114 * economizerExitTemperature ** 3 +
            1.01527e-13 * economizerExitTemperature ** 4 -
            1.53025e-17 * economizerExitTemperature ** 5));

    const heatBalanceImbalance = Math.abs(
      ((economizerHeatAbsorption - heatTransferByEquation) * 100) /
        heatTransferByEquation,
    );

    const specificHeatTransferEconomizer =
      (lastHeatBalance.calculatedHourlyFuelConsumption *
        economizerHeatAbsorption) /
      lastEconomizerCharacteristics.totalHeatTransferSurfaceArea;

    const economizerHeatBalance = this.economizerHeatBalanceRepository.create({
      geometricAdjustmentFactor,
      heatEfficiencyCoefficient,
      heatUtilizationCoefficient,
      economizerExitTemperature,
      combustionProductEnthalpyExit,
      economizerHeatAbsorption,
      maxHeatedMediumTemperature,
      averageHeatedMediumTemperature,
      enthalpyIncrease,
      heatedMediumExitTemperature,
      averageHeatedMediumExitTemperature,
      logarithmicTemperatureDifference,
      averageCombustionTemperature,
      averageCombustionVelocity,
      reynoldsCriterion,
      prandtlCriterion,
      finningCoefficient,
      parameterPhi,
      correctionCoefficientCs,
      correctionCoefficientCz,
      convectiveHeatTransferCoefficient,
      heatTransferCoefficient,
      heatTransferByEquation,
      controlExitTemperature,
      heatBalanceImbalance,
      specificHeatTransferEconomizer,
    });

    return await this.economizerHeatBalanceRepository.save(
      economizerHeatBalance,
    );
  }
}
