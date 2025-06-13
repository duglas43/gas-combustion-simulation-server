import { Injectable } from '@nestjs/common';
import { CreateCalculationDto } from './dto/create-calculation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AirExcessCoefficient } from './entity/air-excess-coefficient.entity';
import { CombustionMaterialBalance } from './entity/combustion-material-balance.entity';
import { ConvectivePackageHeatBalance } from './entity/convective-package-heat-balance.entity';
import { EconomizerHeatBalance } from './entity/economizer-heat-balance.entity';
import { FurnaceHeatBalance } from './entity/furnace-heat-balance.entity';
import { HeatBalance } from './entity/heat-balance.entity';
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
import { Repository } from 'typeorm';

@Injectable()
export class CalculationsService {
  constructor(
    private economizerCharacteristicRepository: EconomizerCharacteristicRepository,
    @InjectRepository(AirExcessCoefficient)
    private airExcessCoefficientRepository: Repository<AirExcessCoefficient>,
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
    @InjectRepository(CombustionMaterialBalance)
    private combustionMaterialBalanceRepository: Repository<CombustionMaterialBalance>,
    @InjectRepository(ConvectivePackageHeatBalance)
    private convectivePackageHeatBalanceRepository: Repository<ConvectivePackageHeatBalance>,
    @InjectRepository(EconomizerHeatBalance)
    private economizerHeatBalanceRepository: Repository<EconomizerHeatBalance>,
    @InjectRepository(FurnaceHeatBalance)
    private furnaceHeatBalanceRepository: Repository<FurnaceHeatBalance>,
    @InjectRepository(HeatBalance)
    private heatBalanceRepository: Repository<HeatBalance>,
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

    await this.createAirExcessCoefficients();
    await this.createCombustionMaterialBalance();
    await this.createHeatBalance();
    await this.createFurnaceHeatBalance();
    await this.createFirstConvectivePackageHeatBalance();
    await this.createSecondConvectivePackageHeatBalance();
    await this.createEconomizerHeatBalance();
    return 'Ok';
  }

  async createAirExcessCoefficients() {
    const boilerCharacteristics =
      await this.boilerCharacteristicRepository.find({
        order: { createdAt: 'DESC' },
      });
    const lastBoilerCharacteristic = boilerCharacteristics[0];
    const airLeakages = await this.airLeakageRepository.find({
      order: { createdAt: 'DESC' },
    });
    const lastAirLeakage = airLeakages[0];

    const airExcessCoefficients: AirExcessCoefficient[] = [];
    const alphaAirExcessCoefficient =
      this.airExcessCoefficientRepository.create({
        name: 'alpha',
        value: 1,
      });
    const alphaBurnerAirExcessCoefficient =
      this.airExcessCoefficientRepository.create({
        name: 'alphaBurner',
        value: lastBoilerCharacteristic.excessAirCoefficient,
      });
    const alphaFurnaceAirExcessCoefficient =
      this.airExcessCoefficientRepository.create({
        name: 'alphaFurnace',
        value:
          alphaBurnerAirExcessCoefficient.value +
          lastAirLeakage.actualFurnaceAirLeakage,
      });
    const alphaFurnaceAvgAirExcessCoefficient =
      this.airExcessCoefficientRepository.create({
        name: 'alphaFurnaceAvg',
        value:
          (alphaBurnerAirExcessCoefficient.value +
            alphaFurnaceAirExcessCoefficient.value) /
          2,
      });
    const alphaConvectivePackage1AirExcessCoefficient =
      this.airExcessCoefficientRepository.create({
        name: 'alphaConvectivePackage1',
        value:
          alphaFurnaceAirExcessCoefficient.value +
          lastAirLeakage.actualFirstConvectiveAirLeakage,
      });
    const alphaConvectivePackage1AvgAirExcessCoefficient =
      this.airExcessCoefficientRepository.create({
        name: 'alphaConvectivePackage1Avg',
        value:
          (alphaFurnaceAirExcessCoefficient.value +
            alphaConvectivePackage1AirExcessCoefficient.value) /
          2,
      });
    const alphaConvectivePackage2AirExcessCoefficient =
      this.airExcessCoefficientRepository.create({
        name: 'alphaConvectivePackage2',
        value:
          alphaFurnaceAirExcessCoefficient.value +
          lastAirLeakage.actualSecondConvectiveAirLeakage,
      });
    const alphaConvectivePackage2AvgAirExcessCoefficient =
      this.airExcessCoefficientRepository.create({
        name: 'alphaConvectivePackage2Avg',
        value:
          (alphaFurnaceAirExcessCoefficient.value +
            alphaConvectivePackage2AirExcessCoefficient.value) /
          2,
      });
    const alphaEconomizerAirExcessCoefficient =
      this.airExcessCoefficientRepository.create({
        name: 'alphaEconomizer',
        value:
          alphaFurnaceAirExcessCoefficient.value +
          lastAirLeakage.actualEconomizerAirLeakage,
      });
    const alphaFlueGasAirExcessCoefficient =
      this.airExcessCoefficientRepository.create({
        name: 'alphaFlueGas',
        value: alphaEconomizerAirExcessCoefficient.value,
      });

    airExcessCoefficients.push(
      alphaAirExcessCoefficient,
      alphaBurnerAirExcessCoefficient,
      alphaFurnaceAirExcessCoefficient,
      alphaFurnaceAvgAirExcessCoefficient,
      alphaConvectivePackage1AirExcessCoefficient,
      alphaConvectivePackage1AvgAirExcessCoefficient,
      alphaConvectivePackage2AirExcessCoefficient,
      alphaConvectivePackage2AvgAirExcessCoefficient,
      alphaEconomizerAirExcessCoefficient,
      alphaFlueGasAirExcessCoefficient,
    );
    return await this.airExcessCoefficientRepository.save(
      airExcessCoefficients,
    );
  }

  async createCombustionMaterialBalance() {
    const combustionMaterialBalanceTemperatures =
      await this.combustionMaterialBalanceTemperatureRepository.find({
        order: { createdAt: 'DESC' },
        take: 1,
      });
    const fuelCompositions = await this.fuelCompositionRepository.find({
      order: { createdAt: 'DESC' },
      take: 1,
    });
    const boilerCharacteristics =
      await this.boilerCharacteristicRepository.find({
        order: { createdAt: 'DESC' },
        take: 1,
      });

    const lastBoilerCharacteristic = boilerCharacteristics[0];
    const lastFuelComposition = fuelCompositions[0];
    const lastCombustionMaterialBalanceTemperature =
      combustionMaterialBalanceTemperatures[0];

    const alphaNames = [
      'alpha',
      'alphaBurner',
      'alphaFurnace',
      'alphaFurnaceAvg',
      'alphaConvectivePackage1',
      'alphaConvectivePackage1Avg',
      'alphaConvectivePackage2',
      'alphaConvectivePackage2Avg',
      'alphaEconomizer',
      'alphaFlueGas',
    ];

    for (const alphaName of alphaNames) {
      const alphaCoefficient = await this.airExcessCoefficientRepository.find({
        where: { name: alphaName },
        order: { createdAt: 'DESC' },
        take: 1,
      });

      const lastAlphaCoefficient = alphaCoefficient[0];

      const theoreticalCO2Volume =
        0.01 *
        (lastFuelComposition.carbonDioxidePercentage +
          lastFuelComposition.carbonMonoxidePercentage +
          lastFuelComposition.methanePercentage +
          2 * lastFuelComposition.ethanePercentage +
          3 * lastFuelComposition.propanePercentage +
          4 *
            (lastFuelComposition.nButanePercentage +
              lastFuelComposition.isoButanePercentage) +
          5 * lastFuelComposition.pentanePercentage +
          2 * lastFuelComposition.acetylenePercentage +
          3 * lastFuelComposition.ethylenePercentage +
          4 * lastFuelComposition.propylenePercentage +
          2 * lastFuelComposition.butylenePercentage);

      const theoreticalWaterVaporVolume =
        0.01 *
          (lastFuelComposition.hydrogenPercentage +
            lastFuelComposition.hydrogenSulfidePercentage +
            2 * lastFuelComposition.methanePercentage +
            3 * lastFuelComposition.ethanePercentage +
            4 * lastFuelComposition.propanePercentage +
            5 *
              (lastFuelComposition.nButanePercentage +
                lastFuelComposition.isoButanePercentage) +
            6 * lastFuelComposition.pentanePercentage +
            2 * lastFuelComposition.acetylenePercentage +
            3 * lastFuelComposition.ethylenePercentage +
            4 * lastFuelComposition.propylenePercentage +
            0.5 * lastFuelComposition.butylenePercentage) +
        0.00124 *
          (lastBoilerCharacteristic.airHumidityForCombustion *
            lastAlphaCoefficient.value *
            lastCombustionMaterialBalanceTemperature.theoreticalDryAirConsumption +
            lastBoilerCharacteristic.gasHumidityForCombustion);

      const theoreticalNitrogenVolume =
        0.79 *
          lastCombustionMaterialBalanceTemperature.theoreticalDryAirConsumption *
          lastAlphaCoefficient.value +
        0.01 * lastFuelComposition.nitrogenPercentage;

      const theoreticalOxygenVolume =
        0.21 *
          (lastAlphaCoefficient.value - 1) *
          lastCombustionMaterialBalanceTemperature.theoreticalDryAirConsumption +
        0.01 * lastFuelComposition.oxygenPercentage;

      const totalWetCombustionProductsVolume =
        theoreticalCO2Volume +
        0 +
        theoreticalWaterVaporVolume +
        theoreticalNitrogenVolume +
        theoreticalOxygenVolume;

      const specificVolumeFractionRO2 =
        theoreticalCO2Volume / totalWetCombustionProductsVolume;

      const specificVolumeFractionWaterVapor =
        theoreticalWaterVaporVolume / totalWetCombustionProductsVolume;

      const specificVolumeFractionTriatomicGases =
        specificVolumeFractionRO2 + specificVolumeFractionWaterVapor;

      const partialPressureRO2 =
        specificVolumeFractionRO2 *
        lastBoilerCharacteristic.flueGasAbsolutePressure;

      const partialPressureWaterVapor =
        specificVolumeFractionWaterVapor *
        lastBoilerCharacteristic.flueGasAbsolutePressure;

      const partialPressureTriatomicGases =
        specificVolumeFractionTriatomicGases *
        lastBoilerCharacteristic.flueGasAbsolutePressure;

      const recirculationRate = 0;

      const specificMassOfCombustionProducts =
        (((theoreticalCO2Volume * 1.977 +
          theoreticalWaterVaporVolume * 0.8041 +
          theoreticalNitrogenVolume * 1.251 +
          theoreticalOxygenVolume * 1.429) /
          totalWetCombustionProductsVolume +
          lastBoilerCharacteristic.gasHumidityForCombustion * 0.001) *
          (1 + recirculationRate) +
          1.306 *
            (lastAlphaCoefficient.value +
              lastAlphaCoefficient.value +
              lastAlphaCoefficient.value * recirculationRate)) *
        totalWetCombustionProductsVolume;

      const combustionMaterialBalance =
        this.combustionMaterialBalanceRepository.create({
          airExcessCoefficientId: lastAlphaCoefficient.id,
          actualWetAirConsumption:
            lastAlphaCoefficient.value *
            lastCombustionMaterialBalanceTemperature.theoreticalWetAirConsumption,
          theoreticalCO2Volume,
          theoreticalSO2Volume: 0,
          theoreticalWaterVaporVolume,
          theoreticalNitrogenVolume,
          theoreticalOxygenVolume,
          totalWetCombustionProductsVolume,
          specificVolumeFractionRO2,
          specificVolumeFractionWaterVapor,
          specificVolumeFractionTriatomicGases,
          partialPressureRO2,
          partialPressureWaterVapor,
          partialPressureTriatomicGases,
          recirculationRate,
          specificMassOfCombustionProducts,
        });

      await this.combustionMaterialBalanceRepository.save(
        combustionMaterialBalance,
      );
    }
  }

  async createHeatBalance() {
    const boilerCharacteristics =
      await this.boilerCharacteristicRepository.find({
        order: { createdAt: 'DESC' },
        take: 1,
      });
    const temperatureCharacteristics =
      await this.temperatureCharacteristicRepository.find({
        order: { createdAt: 'DESC' },
        take: 1,
      });
    const combustionMaterialBalanceTemperatures =
      await this.combustionMaterialBalanceTemperatureRepository.find({
        order: { createdAt: 'DESC' },
        take: 1,
      });
    const alphaFlueGasCoefficient =
      await this.airExcessCoefficientRepository.find({
        where: { name: 'alphaFlueGas' },
        order: { createdAt: 'DESC' },
        take: 1,
      });
    const alphaFlueGasCombustionMaterialBalance =
      await this.combustionMaterialBalanceRepository.find({
        where: { airExcessCoefficient: { name: 'alphaFlueGas' } },
        relations: ['airExcessCoefficient'],
        order: { createdAt: 'DESC' },
        take: 1,
      });

    const lastBoilerCharacteristic = boilerCharacteristics[0];
    const lastTemperatureCharacteristic = temperatureCharacteristics[0];
    const heatLossDueToChemicalIncompleteCombustionPercentage = 0;
    const lastCombustionMaterialBalanceTemperature =
      combustionMaterialBalanceTemperatures[0];
    const lastAlphaFlueGasCombustionMaterialBalance =
      alphaFlueGasCombustionMaterialBalance[0];
    const lastAlphaFlueGasCoefficient = alphaFlueGasCoefficient[0];

    const heatInputFromFuel =
      lastTemperatureCharacteristic.gasMixtureHeatCapacity *
      lastBoilerCharacteristic.gasInletTemperature;
    const heatInputFromAir = 0;
    const availableHeatInputToBoiler =
      heatInputFromFuel +
      heatInputFromAir +
      lastCombustionMaterialBalanceTemperature.lowerHeatingValue;
    const flueGasTemperature = 153;
    const flueGasEnthalpy =
      (lastAlphaFlueGasCombustionMaterialBalance.theoreticalCO2Volume *
        (1.604309582 +
          0.001133138 * flueGasTemperature -
          8.60416e-7 * flueGasTemperature ** 2 +
          4.68441e-10 * flueGasTemperature ** 3 -
          1.44713e-13 * flueGasTemperature ** 4 +
          1.82271e-17 * flueGasTemperature ** 5) +
        lastAlphaFlueGasCombustionMaterialBalance.theoreticalSO2Volume *
          (1.498317949 +
            0.000102932 * flueGasTemperature +
            2.44654e-7 * flueGasTemperature ** 2 -
            1.56126e-10 * flueGasTemperature ** 3 +
            4.36681e-14 * flueGasTemperature ** 4 -
            5.05709e-18 * flueGasTemperature ** 5) +
        lastAlphaFlueGasCombustionMaterialBalance.theoreticalWaterVaporVolume *
          (1.29747332 -
            0.000010563 * flueGasTemperature +
            2.4181e-7 * flueGasTemperature ** 2 -
            1.83389e-10 * flueGasTemperature ** 3 +
            5.85924e-14 * flueGasTemperature ** 4 -
            7.03381e-18 * flueGasTemperature ** 5) +
        lastAlphaFlueGasCombustionMaterialBalance.theoreticalNitrogenVolume *
          (1.306450711 +
            0.000150251 * flueGasTemperature +
            1.72284e-7 * flueGasTemperature ** 2 -
            2.32114e-10 * flueGasTemperature ** 3 +
            1.01527e-13 * flueGasTemperature ** 4 -
            1.53025e-17 * flueGasTemperature ** 5) +
        lastAlphaFlueGasCombustionMaterialBalance.theoreticalOxygenVolume *
          (1.285314861 +
            0.0001585 * flueGasTemperature -
            4.77872e-7 * flueGasTemperature ** 2 +
            7.55826e-10 * flueGasTemperature ** 3 -
            5.20124e-13 * flueGasTemperature ** 4 +
            1.33782e-16 * flueGasTemperature ** 5)) *
      flueGasTemperature;
    const surroundingAirEnthalpy =
      lastCombustionMaterialBalanceTemperature.theoreticalWetAirConsumption *
      lastTemperatureCharacteristic.boilerRoomAirHeatCapacity *
      lastBoilerCharacteristic.roomAirTemperature;
    const heatLossWithFlueGases =
      flueGasEnthalpy -
      (lastAlphaFlueGasCoefficient.value - 1) * surroundingAirEnthalpy;
    const heatLossWithFlueGasesPercentage =
      (heatLossWithFlueGases * 100) / availableHeatInputToBoiler;

    const heatLossDueToChemicalIncompleteCombustion =
      (heatLossDueToChemicalIncompleteCombustionPercentage *
        availableHeatInputToBoiler) /
      100;

    const heatLossThroughOuterWallsPercentage =
      ((0.255252565 +
        47.36314226 / lastBoilerCharacteristic.nominalSteamProduction +
        -834.3872002 / lastBoilerCharacteristic.nominalSteamProduction ** 2 +
        8019.779143 / lastBoilerCharacteristic.nominalSteamProduction ** 3 +
        -32277.77998 / lastBoilerCharacteristic.nominalSteamProduction ** 4 +
        44135.89981 / lastBoilerCharacteristic.nominalSteamProduction ** 5) *
        100) /
      lastBoilerCharacteristic.loadPercentage;
    const heatLossThroughOuterWalls =
      (availableHeatInputToBoiler * heatLossThroughOuterWallsPercentage) / 100;

    const boilerEfficiencyGross =
      100 -
      heatLossWithFlueGasesPercentage -
      heatLossDueToChemicalIncompleteCombustionPercentage -
      heatLossThroughOuterWallsPercentage;

    const totalHeatLoss =
      heatLossWithFlueGases +
      heatLossDueToChemicalIncompleteCombustion +
      heatLossThroughOuterWalls;

    const blowdownWaterFlow =
      (0.01 *
        lastBoilerCharacteristic.blowdownPercentage *
        lastBoilerCharacteristic.nominalSteamProduction *
        lastBoilerCharacteristic.loadPercentage) /
      100;

    const usefulHeatUtilized =
      (((lastBoilerCharacteristic.nominalSteamProduction *
        lastBoilerCharacteristic.loadPercentage) /
        100) *
        (2529.561501 +
          689.7698653 *
            (lastBoilerCharacteristic.excessPressureInBoiler + 0.1) ** 0.5 +
          -945.4105533 *
            (lastBoilerCharacteristic.excessPressureInBoiler + 0.1) +
          798.3009619 *
            (lastBoilerCharacteristic.excessPressureInBoiler + 0.1) ** 1.5 +
          -357.523749 *
            (lastBoilerCharacteristic.excessPressureInBoiler + 0.1) ** 2 +
          63.1843854 *
            (lastBoilerCharacteristic.excessPressureInBoiler + 0.1) ** 2.5 -
          (4.21728893897003 +
            -4.24888399827776e-4 *
              lastBoilerCharacteristic.feedWaterTemperature +
            -1.90766415583401e-5 *
              lastBoilerCharacteristic.feedWaterTemperature ** 2 +
            3.73685094570715e-7 *
              lastBoilerCharacteristic.feedWaterTemperature ** 3 +
            -1.82785185562934e-9 *
              lastBoilerCharacteristic.feedWaterTemperature ** 4 +
            3.30764930384364e-12 *
              lastBoilerCharacteristic.feedWaterTemperature ** 5) *
            lastBoilerCharacteristic.feedWaterTemperature) +
        blowdownWaterFlow *
          (63.3125516389845 +
            1600.35159333891 *
              (lastBoilerCharacteristic.excessPressureInBoiler + 0.1) ** 0.5 +
            -2000.28710382556 *
              (lastBoilerCharacteristic.excessPressureInBoiler + 0.1) +
            1744.33493642283 *
              (lastBoilerCharacteristic.excessPressureInBoiler + 0.1) ** 1.5 +
            -785.768886299272 *
              (lastBoilerCharacteristic.excessPressureInBoiler + 0.1) ** 2 +
            140.026972257752 *
              (lastBoilerCharacteristic.excessPressureInBoiler + 0.1) ** 2.5 -
            (4.21728893897003 +
              -4.24888399827776e-4 *
                lastBoilerCharacteristic.feedWaterTemperature +
              -1.90766415583401e-5 *
                lastBoilerCharacteristic.feedWaterTemperature ** 2 +
              3.73685094570715e-7 *
                lastBoilerCharacteristic.feedWaterTemperature ** 3 +
              -1.82785185562934e-9 *
                lastBoilerCharacteristic.feedWaterTemperature ** 4 +
              3.30764930384364e-12 *
                lastBoilerCharacteristic.feedWaterTemperature ** 5) *
              lastBoilerCharacteristic.feedWaterTemperature)) *
      1000;

    const calculatedHourlyFuelConsumption =
      (usefulHeatUtilized * 100) /
      (availableHeatInputToBoiler * boilerEfficiencyGross);

    const heatedHeatCarrierFlow =
      (lastBoilerCharacteristic.actualSteamProduction + blowdownWaterFlow) *
      1000;

    const heatRetentionCoefficient =
      1 -
      heatLossThroughOuterWallsPercentage /
        (heatLossThroughOuterWallsPercentage + boilerEfficiencyGross);

    const heatBalance = this.heatBalanceRepository.create({
      heatLossDueToChemicalIncompleteCombustionPercentage,
      heatInputFromFuel,
      heatInputFromAir,
      availableHeatInputToBoiler,
      flueGasTemperature,
      flueGasEnthalpy,
      surroundingAirEnthalpy,
      heatLossWithFlueGases,
      heatLossWithFlueGasesPercentage,
      heatLossDueToChemicalIncompleteCombustion,
      heatLossThroughOuterWallsPercentage,
      heatLossThroughOuterWalls,
      boilerEfficiencyGross,
      totalHeatLoss,
      blowdownWaterFlow,
      usefulHeatUtilized,
      calculatedHourlyFuelConsumption,
      heatedHeatCarrierFlow,
      heatRetentionCoefficient,
    });

    return await this.heatBalanceRepository.save(heatBalance);
  }

  async createFurnaceHeatBalance() {
    const furnaceCharacteristics =
      await this.furnaceCharacteristicRepository.find({
        order: { createdAt: 'DESC' },
        take: 1,
      });
    const alphaBurnerCombustionMaterialBalance =
      await this.combustionMaterialBalanceRepository.find({
        where: { airExcessCoefficient: { name: 'alphaBurner' } },
        relations: ['airExcessCoefficient'],
        order: { createdAt: 'DESC' },
        take: 1,
      });
    const combustionMaterialBalanceTemperatures =
      await this.combustionMaterialBalanceTemperatureRepository.find({
        order: { createdAt: 'DESC' },
        take: 1,
      });
    const temperatureCharacteristics =
      await this.temperatureCharacteristicRepository.find({
        order: { createdAt: 'DESC' },
        take: 1,
      });
    const alphaBurnerAirExcessCoefficient =
      await this.airExcessCoefficientRepository.find({
        where: { name: 'alphaBurner' },
        order: { createdAt: 'DESC' },
        take: 1,
      });
    const airLeakages = await this.airLeakageRepository.find({
      order: { createdAt: 'DESC' },
      take: 1,
    });
    const heatBalances = await this.heatBalanceRepository.find({
      order: { createdAt: 'DESC' },
      take: 1,
    });
    const alphaFurnaceAvgCombustionMaterialBalance =
      await this.combustionMaterialBalanceRepository.find({
        where: { airExcessCoefficient: { name: 'alphaFurnaceAvg' } },
        relations: ['airExcessCoefficient'],
        order: { createdAt: 'DESC' },
        take: 1,
      });
    const fuelCompositions = await this.fuelCompositionRepository.find({
      order: { createdAt: 'DESC' },
      take: 1,
    });
    const boilerCharacteristics =
      await this.boilerCharacteristicRepository.find({
        order: { createdAt: 'DESC' },
        take: 1,
      });

    const lastBoilerCharacteristic = boilerCharacteristics[0];
    const lastFuelComposition = fuelCompositions[0];
    const lastHeatBalance = heatBalances[0];
    const lastAirLeakage = airLeakages[0];
    const lastAlphaBurnerAirExcessCoefficient =
      alphaBurnerAirExcessCoefficient[0];
    const lastTemperatureCharacteristic = temperatureCharacteristics[0];
    const lastCombustionMaterialBalanceTemperature =
      combustionMaterialBalanceTemperatures[0];
    const lastAlphaBurnerCombustionMaterialBalance =
      alphaBurnerCombustionMaterialBalance[0];
    const lastFurnaceCharacteristic = furnaceCharacteristics[0];
    const lastAlphaFurnaceAvgCombustionMaterialBalance =
      alphaFurnaceAvgCombustionMaterialBalance[0];

    const parameterM0 = 0.4;
    const luminousFlameFillingCoefficient = 0.1;
    const blackBodyRadiationCoefficient = 20.53e-8;
    const screenPollutionCoefficient =
      lastFurnaceCharacteristic.screenContaminationFactor;
    const furnaceExitTemperatureSet = 844;

    const combustionProductEnthalpyExit =
      (lastAlphaBurnerCombustionMaterialBalance.theoreticalCO2Volume *
        (1.604309582 +
          0.001133138 * furnaceExitTemperatureSet +
          -0.000000860416 * furnaceExitTemperatureSet ** 2 +
          0.000000000468441 * furnaceExitTemperatureSet ** 3 +
          -1.44713e-13 * furnaceExitTemperatureSet ** 4 +
          1.822707e-17 * furnaceExitTemperatureSet ** 5) +
        lastAlphaBurnerCombustionMaterialBalance.theoreticalSO2Volume *
          (0.607026715343734 +
            3.08631797297832e-4 * furnaceExitTemperatureSet +
            -1.59369965554858e-7 * furnaceExitTemperatureSet ** 2 +
            1.63637023130679e-11 * furnaceExitTemperatureSet ** 3 +
            1.25572787709454e-14 * furnaceExitTemperatureSet ** 4 +
            -3.03012265579358e-18 * furnaceExitTemperatureSet ** 5) +
        lastAlphaBurnerCombustionMaterialBalance.theoreticalWaterVaporVolume *
          (1.498317949 +
            0.000102932 * furnaceExitTemperatureSet +
            0.000000244654 * furnaceExitTemperatureSet ** 2 +
            -0.000000000156126 * furnaceExitTemperatureSet ** 3 +
            4.36681e-14 * furnaceExitTemperatureSet ** 4 +
            -5.05709e-18 * furnaceExitTemperatureSet ** 5) +
        lastAlphaBurnerCombustionMaterialBalance.theoreticalNitrogenVolume *
          (1.29747332 +
            -0.000010563 * furnaceExitTemperatureSet +
            0.00000024181 * furnaceExitTemperatureSet ** 2 +
            -0.000000000183389 * furnaceExitTemperatureSet ** 3 +
            5.85924e-14 * furnaceExitTemperatureSet ** 4 +
            -7.03381e-18 * furnaceExitTemperatureSet ** 5) +
        lastAlphaBurnerCombustionMaterialBalance.theoreticalOxygenVolume *
          (1.306450711 +
            0.000150251 * furnaceExitTemperatureSet +
            0.000000172284 * furnaceExitTemperatureSet ** 2 +
            -0.000000000232114 * furnaceExitTemperatureSet ** 3 +
            1.01527e-13 * furnaceExitTemperatureSet ** 4 +
            -1.53025e-17 * furnaceExitTemperatureSet ** 5)) *
      furnaceExitTemperatureSet;

    const combustionAirEnthalpy =
      lastCombustionMaterialBalanceTemperature.theoreticalWetAirConsumption *
      lastTemperatureCharacteristic.combustionAirHeatCapacity *
      lastTemperatureCharacteristic.combustionAirTemperature;

    const airFractionFromAirPreheater =
      lastAlphaBurnerAirExcessCoefficient.value;
    const heatInputToFurnaceFromAir =
      airFractionFromAirPreheater * combustionAirEnthalpy +
      lastAirLeakage.actualFurnaceAirLeakage *
        lastHeatBalance.surroundingAirEnthalpy;

    const usefulHeatReleaseInFurnace =
      lastHeatBalance.availableHeatInputToBoiler *
        ((100 -
          lastHeatBalance.heatLossDueToChemicalIncompleteCombustionPercentage) /
          100) +
      heatInputToFurnaceFromAir -
      lastHeatBalance.heatInputFromAir;
    const assumedAdiabaticCombustionTemperature = 2200;
    const actualAdiabaticCombustionTemperature =
      usefulHeatReleaseInFurnace /
      (lastAlphaFurnaceAvgCombustionMaterialBalance.theoreticalCO2Volume *
        (1.604309582 +
          0.001133138 * assumedAdiabaticCombustionTemperature +
          -0.000000860416 * assumedAdiabaticCombustionTemperature ** 2 +
          0.000000000468441 * assumedAdiabaticCombustionTemperature ** 3 +
          -1.44713e-13 * assumedAdiabaticCombustionTemperature ** 4 +
          1.822707e-17 * assumedAdiabaticCombustionTemperature ** 5) +
        lastAlphaFurnaceAvgCombustionMaterialBalance.theoreticalSO2Volume *
          (0.607026715343734 +
            3.08631797297832e-4 * assumedAdiabaticCombustionTemperature +
            -1.59369965554858e-7 * assumedAdiabaticCombustionTemperature ** 2 +
            1.63637023130679e-11 * assumedAdiabaticCombustionTemperature ** 3 +
            1.25572787709454e-14 * assumedAdiabaticCombustionTemperature ** 4 +
            -3.03012265579358e-18 *
              assumedAdiabaticCombustionTemperature ** 5) +
        lastAlphaFurnaceAvgCombustionMaterialBalance.theoreticalWaterVaporVolume *
          (1.498317949 +
            0.000102932 * assumedAdiabaticCombustionTemperature +
            0.000000244654 * assumedAdiabaticCombustionTemperature ** 2 +
            -0.000000000156126 * assumedAdiabaticCombustionTemperature ** 3 +
            4.36681e-14 * assumedAdiabaticCombustionTemperature ** 4 +
            -5.05709e-18 * assumedAdiabaticCombustionTemperature ** 5) +
        lastAlphaFurnaceAvgCombustionMaterialBalance.theoreticalNitrogenVolume *
          (1.29747332 +
            -0.000010563 * assumedAdiabaticCombustionTemperature +
            0.00000024181 * assumedAdiabaticCombustionTemperature ** 2 +
            -0.000000000183389 * assumedAdiabaticCombustionTemperature ** 3 +
            5.85924e-14 * assumedAdiabaticCombustionTemperature ** 4 +
            -7.03381e-18 * assumedAdiabaticCombustionTemperature ** 5) +
        lastAlphaFurnaceAvgCombustionMaterialBalance.theoreticalOxygenVolume *
          (1.306450711 +
            0.000150251 * assumedAdiabaticCombustionTemperature +
            0.000000172284 * assumedAdiabaticCombustionTemperature ** 2 +
            -0.000000000232114 * assumedAdiabaticCombustionTemperature ** 3 +
            1.01527e-13 * assumedAdiabaticCombustionTemperature ** 4 +
            -1.53025e-17 * assumedAdiabaticCombustionTemperature ** 5));

    const imbalancePercentage = Math.abs(
      ((assumedAdiabaticCombustionTemperature -
        actualAdiabaticCombustionTemperature) *
        100) /
        actualAdiabaticCombustionTemperature,
    );
    const averageHeatCapacityProductsInFurnace =
      (usefulHeatReleaseInFurnace - combustionProductEnthalpyExit) /
      (actualAdiabaticCombustionTemperature - furnaceExitTemperatureSet);

    const averageThermalEfficiencyCoefficient =
      ((lastFurnaceCharacteristic.firstScreenArea *
        lastFurnaceCharacteristic.firstScreenAngleCoefficient +
        lastFurnaceCharacteristic.secondScreenArea *
          lastFurnaceCharacteristic.secondScreenAngleCoefficient +
        lastFurnaceCharacteristic.thirdScreenArea *
          lastFurnaceCharacteristic.thirdScreenAngleCoefficient +
        lastFurnaceCharacteristic.fourthScreenArea *
          lastFurnaceCharacteristic.fourthScreenAngleCoefficient +
        lastFurnaceCharacteristic.fifthScreenArea *
          lastFurnaceCharacteristic.fifthScreenAngleCoefficient) *
        screenPollutionCoefficient) /
      lastFurnaceCharacteristic.totalWallSurfaceArea;

    const boltzmannCriterion =
      (lastHeatBalance.heatRetentionCoefficient *
        lastHeatBalance.calculatedHourlyFuelConsumption *
        averageHeatCapacityProductsInFurnace) /
      (blackBodyRadiationCoefficient *
        averageThermalEfficiencyCoefficient *
        lastFurnaceCharacteristic.totalWallSurfaceArea *
        (actualAdiabaticCombustionTemperature + 273.15) ** 3);

    const maxTemperatureZoneHeight =
      (((lastFurnaceCharacteristic.burnersInFirstRow *
        lastHeatBalance.calculatedHourlyFuelConsumption) /
        lastFurnaceCharacteristic.totalBurnersInBoiler) *
        lastFurnaceCharacteristic.firstBurnerRowHeight) /
      ((lastFurnaceCharacteristic.totalBurnersInBoiler *
        lastHeatBalance.calculatedHourlyFuelConsumption) /
        lastFurnaceCharacteristic.totalBurnersInBoiler);
    const relativeMaxTemperatureZonePosition =
      maxTemperatureZoneHeight / lastFurnaceCharacteristic.furnaceHeight;

    const furnaceGasDilutionCoefficient =
      (lastAlphaFurnaceAvgCombustionMaterialBalance.totalWetCombustionProductsVolume *
        (1 - lastTemperatureCharacteristic.recirculationRate)) /
      (lastAlphaFurnaceAvgCombustionMaterialBalance.theoreticalCO2Volume +
        lastAlphaFurnaceAvgCombustionMaterialBalance.theoreticalSO2Volume +
        lastAlphaFurnaceAvgCombustionMaterialBalance.theoreticalNitrogenVolume);

    const calculatedParameterM =
      parameterM0 *
      (1 - 0.4 * relativeMaxTemperatureZonePosition) *
      furnaceGasDilutionCoefficient ** 0.3333;

    const rayAttenuationCoefficientThreeAtomGases =
      ((7.8 +
        16 *
          lastAlphaFurnaceAvgCombustionMaterialBalance.specificVolumeFractionWaterVapor) /
        (3.16 *
          Math.sqrt(
            lastAlphaFurnaceAvgCombustionMaterialBalance.specificVolumeFractionTriatomicGases *
              lastFurnaceCharacteristic.effectiveRadiatingLayerThickness,
          )) -
        1) *
      (1 - (0.37 * (blackBodyRadiationCoefficient + 273.15)) / 1000) *
      lastAlphaFurnaceAvgCombustionMaterialBalance.specificVolumeFractionTriatomicGases;

    const carbonToHydrogenMassRatio =
      0.12 *
      ((1 / 4) * lastFuelComposition.methanePercentage +
        (2 / 6) * lastFuelComposition.ethanePercentage +
        (3 / 8) * lastFuelComposition.propanePercentage +
        (4 / 10) *
          (lastFuelComposition.nButanePercentage +
            lastFuelComposition.isoButanePercentage) +
        (5 / 12) * lastFuelComposition.pentanePercentage +
        (2 / 4) * lastFuelComposition.ethylenePercentage +
        (3 / 6) * lastFuelComposition.propylenePercentage +
        (4 / 8) * lastFuelComposition.butylenePercentage +
        (2 / 2) * lastFuelComposition.acetylenePercentage);

    const sootRayAttenuationCoefficient =
      (1.2 / (1 + lastAlphaBurnerAirExcessCoefficient.value ** 2)) *
      ((1.6 * (furnaceExitTemperatureSet + 273.15)) / 1000 - 0.5) *
      carbonToHydrogenMassRatio ** 0.4;

    const furnaceMediumAbsorptionCoefficient =
      rayAttenuationCoefficientThreeAtomGases +
      luminousFlameFillingCoefficient * sootRayAttenuationCoefficient;

    const bugerCriterion =
      furnaceMediumAbsorptionCoefficient *
      lastBoilerCharacteristic.flueGasAbsolutePressure *
      lastFurnaceCharacteristic.effectiveRadiatingLayerThickness;

    const effectiveBugerCriterion =
      1.6 *
      Math.log(
        (1.4 * bugerCriterion ** 2 + bugerCriterion + 2) /
          (1.4 * bugerCriterion ** 2 - bugerCriterion + 2),
      );
    const combustionProductExitTemperature =
      (actualAdiabaticCombustionTemperature + 273.15) /
        (calculatedParameterM *
          bugerCriterion ** 0.3 *
          (1 / boltzmannCriterion) ** 0.6 +
          1) -
      273;
    const calculatedImbalance = Math.abs(
      ((combustionProductExitTemperature - furnaceExitTemperatureSet) * 100) /
        combustionProductExitTemperature,
    );
    const heatAbsorbedByRadiativeScreens =
      lastHeatBalance.heatRetentionCoefficient *
      (usefulHeatReleaseInFurnace - combustionProductEnthalpyExit);

    const specificHeatLoadRadiativeScreens =
      (lastHeatBalance.calculatedHourlyFuelConsumption *
        heatAbsorbedByRadiativeScreens) /
      lastFurnaceCharacteristic.totalRadiantHeatSurfaceArea;

    const specificHeatTensionFurnaceVolume =
      (lastHeatBalance.calculatedHourlyFuelConsumption *
        usefulHeatReleaseInFurnace) /
      lastFurnaceCharacteristic.furnaceVolume;

    const enthalpyIncrementHeatedHeatCarrier =
      (lastHeatBalance.calculatedHourlyFuelConsumption *
        (heatAbsorbedByRadiativeScreens - 0)) /
      lastHeatBalance.heatedHeatCarrierFlow;

    const furnaceHeatBalance = this.furnaceHeatBalanceRepository.create({
      blackBodyRadiationCoefficient,
      screenPollutionCoefficient,
      parameterM0,
      luminousFlameFillingCoefficient,
      furnaceExitTemperatureSet,
      combustionProductEnthalpyExit,
      combustionAirEnthalpy,
      airFractionFromAirPreheater,
      heatInputToFurnaceFromAir,
      usefulHeatReleaseInFurnace,
      assumedAdiabaticCombustionTemperature,
      actualAdiabaticCombustionTemperature,
      imbalancePercentage,
      averageHeatCapacityProductsInFurnace,
      averageThermalEfficiencyCoefficient,
      boltzmannCriterion,
      maxTemperatureZoneHeight,
      relativeMaxTemperatureZonePosition,
      furnaceGasDilutionCoefficient,
      calculatedParameterM,
      rayAttenuationCoefficientThreeAtomGases,
      carbonToHydrogenMassRatio,
      sootRayAttenuationCoefficient,
      furnaceMediumAbsorptionCoefficient,
      bugerCriterion,
      effectiveBugerCriterion,
      combustionProductExitTemperature,
      calculatedImbalance,
      heatAbsorbedByRadiativeScreens,
      specificHeatLoadRadiativeScreens,
      specificHeatTensionFurnaceVolume,
      enthalpyIncrementHeatedHeatCarrier,
    });
    return await this.furnaceHeatBalanceRepository.save(furnaceHeatBalance);
  }

  async createFirstConvectivePackageHeatBalance() {
    const convectivePackageCharacteristics =
      await this.convectivePackageRepository.find({
        where: { packageNumber: 1 },
        order: { createdAt: 'DESC' },
        take: 1,
      });
    const firstConvectivePackageCharacteristics =
      convectivePackageCharacteristics[0];
    const heatBalances = await this.heatBalanceRepository.find({
      order: { createdAt: 'DESC' },
      take: 1,
    });
    const alphaFirstConvectivePackageCombustionMaterialBalance =
      await this.combustionMaterialBalanceRepository.find({
        where: {
          airExcessCoefficient: { name: 'alphaConvectivePackage1' },
        },
        relations: ['airExcessCoefficient'],
        order: { createdAt: 'DESC' },
        take: 1,
      });
    const alphaFirstConvectiveAvgCombustionMaterialBalance =
      await this.combustionMaterialBalanceRepository.find({
        where: {
          airExcessCoefficient: { name: 'alphaConvectivePackage1Avg' },
        },
        relations: ['airExcessCoefficient'],
        order: { createdAt: 'DESC' },
        take: 1,
      });

    const furnaceHeatBalances = await this.furnaceHeatBalanceRepository.find({
      order: { createdAt: 'DESC' },
      take: 1,
    });

    const airLeakages = await this.airLeakageRepository.find({
      order: { createdAt: 'DESC' },
      take: 1,
    });
    const boilerCharacteristics =
      await this.boilerCharacteristicRepository.find({
        order: { createdAt: 'DESC' },
        take: 1,
      });

    const lastAlphaFirstAvgCombustionMaterialBalance =
      alphaFirstConvectiveAvgCombustionMaterialBalance[0];
    const lastBoilerCharacteristic = boilerCharacteristics[0];
    const lastAirLeakage = airLeakages[0];
    const lastFurnaceHeatBalance = furnaceHeatBalances[0];
    const lastHeatBalance = heatBalances[0];
    const lastAlphaFirstConvectivePackageCombustionMaterialBalance =
      alphaFirstConvectivePackageCombustionMaterialBalance[0];

    const averageHeatAbsorptionCoefficient = 0.7;
    const sumAngularCoefficients = 0.949;
    const furnaceExitWindowArea = 2.327;
    const geometricAdjustmentFactor = 1;
    const screenWallBlacknessDegree = 0.8;
    const heatEfficiencyCoefficient = 0.8;
    const heatUtilizationCoefficient = 0.95;
    const packageExitTemperature = 291.4;

    const combustionProductEnthalpyExit =
      (lastAlphaFirstConvectivePackageCombustionMaterialBalance.theoreticalCO2Volume *
        (1.604309582 +
          0.001133138 * packageExitTemperature +
          -8.60416e-7 * packageExitTemperature ** 2 +
          4.68441e-10 * packageExitTemperature ** 3 +
          -1.44713e-13 * packageExitTemperature ** 4 +
          1.82271e-17 * packageExitTemperature ** 5) +
        lastAlphaFirstConvectivePackageCombustionMaterialBalance.theoreticalWaterVaporVolume *
          (1.498317949 +
            0.000109232 * packageExitTemperature +
            -2.44654e-7 * packageExitTemperature ** 2 +
            2.46157e-10 * packageExitTemperature ** 3 +
            -1.56162e-13 * packageExitTemperature ** 4 +
            -5.57059e-18 * packageExitTemperature ** 5) +
        lastAlphaFirstConvectivePackageCombustionMaterialBalance.theoreticalOxygenVolume *
          (1.306450711 +
            0.000150251 * packageExitTemperature +
            1.72284e-7 * packageExitTemperature ** 2 +
            -2.32114e-10 * packageExitTemperature ** 3 +
            1.01527e-13 * packageExitTemperature ** 4 +
            -1.53025e-17 * packageExitTemperature ** 5) +
        lastAlphaFirstConvectivePackageCombustionMaterialBalance.theoreticalNitrogenVolume *
          (1.29747332 +
            -0.000010563 * packageExitTemperature +
            2.4181e-7 * packageExitTemperature ** 2 +
            -1.83389e-10 * packageExitTemperature ** 3 +
            5.85924e-14 * packageExitTemperature ** 4 +
            -7.03381e-18 * packageExitTemperature ** 5) +
        lastAlphaFirstConvectivePackageCombustionMaterialBalance.theoreticalSO2Volume *
          (0.607026715 +
            0.000308632 * packageExitTemperature +
            -1.5937e-7 * packageExitTemperature ** 2 +
            1.63367e-11 * packageExitTemperature ** 3 +
            1.25573e-14 * packageExitTemperature ** 4 +
            -3.03012e-18 * packageExitTemperature ** 5)) *
      packageExitTemperature;

    const heatBalanceAbsorption =
      lastHeatBalance.heatRetentionCoefficient *
      (lastFurnaceHeatBalance.combustionProductEnthalpyExit -
        combustionProductEnthalpyExit +
        lastAirLeakage.actualFirstConvectiveAirLeakage *
          lastHeatBalance.surroundingAirEnthalpy);

    const radiativeHeatLoad = 0;
    const heatReceivedByRadiation =
      (radiativeHeatLoad * furnaceExitWindowArea * sumAngularCoefficients) /
      lastHeatBalance.calculatedHourlyFuelConsumption;

    const enthalpyIncrease =
      ((heatBalanceAbsorption + heatReceivedByRadiation) *
        lastHeatBalance.calculatedHourlyFuelConsumption) /
      lastHeatBalance.heatedHeatCarrierFlow;

    const heatedMediumTemperature =
      14.46082904 +
      391.6645325 *
        (lastBoilerCharacteristic.excessPressureInBoiler + 0.1) ** 0.5 +
      -515.7577364 * (lastBoilerCharacteristic.excessPressureInBoiler + 0.1) +
      380.9431696 *
        (lastBoilerCharacteristic.excessPressureInBoiler + 0.1) ** 1.5 +
      -218.8244384 *
        (lastBoilerCharacteristic.excessPressureInBoiler + 0.1) ** 2 +
      40.22947271 *
        (lastBoilerCharacteristic.excessPressureInBoiler + 0.1) ** 2.5;

    const logarithmicTemperatureDifference =
      ((lastFurnaceHeatBalance.combustionProductExitTemperature -
        heatedMediumTemperature -
        (packageExitTemperature - heatedMediumTemperature)) *
        geometricAdjustmentFactor) /
      Math.log(
        (lastFurnaceHeatBalance.combustionProductExitTemperature -
          heatedMediumTemperature) /
          (packageExitTemperature - heatedMediumTemperature),
      );
    const averageCombustionTemperature =
      (lastFurnaceHeatBalance.combustionProductExitTemperature +
        packageExitTemperature) /
      2;

    const averageCombustionVelocity =
      (lastHeatBalance.calculatedHourlyFuelConsumption *
        lastAlphaFirstAvgCombustionMaterialBalance.totalWetCombustionProductsVolume *
        (averageCombustionTemperature + 273.15)) /
      (3600 *
        firstConvectivePackageCharacteristics.channelCrossSectionArea *
        273.15);

    const reynoldsCriterion =
      (averageCombustionVelocity *
        firstConvectivePackageCharacteristics.equivalentChannelDiameter) /
      (1.196865e-5 +
        2.791535e-8 * averageCombustionTemperature +
        -3.514694e-11 * averageCombustionTemperature ** 2 +
        2.273281e-14 * averageCombustionTemperature ** 3 +
        -7.561365e-18 * averageCombustionTemperature ** 4 +
        1.046736e-21 * averageCombustionTemperature ** 5);

    const prandtlCriterion =
      0.738892754 +
      1.5913e-4 * averageCombustionTemperature +
      -5.713939e-7 * averageCombustionTemperature ** 2 +
      1.035111e-9 * averageCombustionTemperature ** 3 +
      -1.1723e-12 * averageCombustionTemperature ** 4 +
      5.29942e-16 * averageCombustionTemperature ** 5;

    const correctionCoefficientCs =
      ((1 +
        (2 * firstConvectivePackageCharacteristics.relativeTubePitchInRow - 3) *
          (1 - firstConvectivePackageCharacteristics.relativeRowPitch / 2)) **
        3) **
      -2;

    const correctionCoefficientCz = 1;
    const convectiveHeatTransferCoefficient =
      ((0.2 *
        (0.081620792 +
          0.000057156 * averageCombustionTemperature +
          -7.139937e-8 * averageCombustionTemperature ** 2 +
          9.573195e-11 * averageCombustionTemperature ** 3 +
          -1.042761e-13 * averageCombustionTemperature ** 4 +
          4.124561e-17 * averageCombustionTemperature ** 5)) /
        (firstConvectivePackageCharacteristics.outerTubeDiameter * 0.001)) *
      reynoldsCriterion ** 0.65 *
      prandtlCriterion ** 0.33 *
      correctionCoefficientCs *
      correctionCoefficientCz;

    const threeAtomGasRayAttenuationCoefficient =
      ((7.8 +
        16 *
          lastAlphaFirstAvgCombustionMaterialBalance.specificVolumeFractionWaterVapor) /
        (3.16 *
          Math.sqrt(
            lastAlphaFirstAvgCombustionMaterialBalance.partialPressureTriatomicGases *
              firstConvectivePackageCharacteristics.effectiveRadiatingLayerThickness,
          )) -
        1) *
      (1 - (0.37 * (packageExitTemperature + 273.15)) / 1000) *
      lastAlphaFirstAvgCombustionMaterialBalance.specificVolumeFractionTriatomicGases;

    const radiativeLayerOpticalThickness =
      threeAtomGasRayAttenuationCoefficient *
      lastBoilerCharacteristic.flueGasAbsolutePressure *
      firstConvectivePackageCharacteristics.effectiveRadiatingLayerThickness;

    const effectiveBlacknessDegree =
      1 - Math.exp(-radiativeLayerOpticalThickness);

    const averageWallTemperature = heatedMediumTemperature + 25;

    const radiativeHeatTransferCoefficient =
      lastFurnaceHeatBalance.blackBodyRadiationCoefficient *
      (screenWallBlacknessDegree + 1) *
      0.5 *
      effectiveBlacknessDegree *
      (averageCombustionTemperature + 273.15) ** 3 *
      ((1 -
        ((averageWallTemperature + 273.15) /
          (averageCombustionTemperature + 273.15)) **
          3.6) /
        (1 -
          (averageWallTemperature + 273.15) /
            (averageCombustionTemperature + 273.15)));

    const heatTransferCoefficient =
      heatEfficiencyCoefficient *
      heatUtilizationCoefficient *
      (convectiveHeatTransferCoefficient + radiativeHeatTransferCoefficient);

    const heatTransferByEquation =
      (heatTransferCoefficient *
        firstConvectivePackageCharacteristics.convectivePackageHeatSurfaceArea *
        logarithmicTemperatureDifference) /
      lastHeatBalance.calculatedHourlyFuelConsumption;

    const exitTemperatureControlValue =
      (lastFurnaceHeatBalance.combustionProductEnthalpyExit -
        heatTransferByEquation / lastHeatBalance.heatRetentionCoefficient +
        lastAirLeakage.actualFirstConvectiveAirLeakage *
          lastHeatBalance.surroundingAirEnthalpy) /
      (lastAlphaFirstConvectivePackageCombustionMaterialBalance.theoreticalCO2Volume *
        (1.604309582 +
          0.001133138 * packageExitTemperature +
          -8.60416e-7 * packageExitTemperature ** 2 +
          4.68441e-10 * packageExitTemperature ** 3 +
          -1.44713e-13 * packageExitTemperature ** 4 +
          1.82271e-17 * packageExitTemperature ** 5) +
        lastAlphaFirstConvectivePackageCombustionMaterialBalance.theoreticalSO2Volume *
          (0.607026715 +
            0.003008632 * packageExitTemperature +
            -1.5937e-7 * packageExitTemperature ** 2 +
            1.63637e-11 * packageExitTemperature ** 3 +
            -2.57357e-14 * packageExitTemperature ** 4 +
            -3.03012e-18 * packageExitTemperature ** 5) +
        lastAlphaFirstConvectivePackageCombustionMaterialBalance.theoreticalWaterVaporVolume *
          (1.306704025 +
            -6.71883e-6 * packageExitTemperature +
            2.59388e-7 * packageExitTemperature ** 2 +
            -1.60902e-10 * packageExitTemperature ** 3 +
            1.14164e-14 * packageExitTemperature ** 4 +
            1.04936e-17 * packageExitTemperature ** 5) +
        lastAlphaFirstConvectivePackageCombustionMaterialBalance.theoreticalNitrogenVolume *
          (1.306450711 +
            0.000150251 * packageExitTemperature +
            1.72284e-7 * packageExitTemperature ** 2 +
            -2.32114e-10 * packageExitTemperature ** 3 +
            1.01527e-13 * packageExitTemperature ** 4 +
            -1.53025e-17 * packageExitTemperature ** 5) +
        lastAlphaFirstConvectivePackageCombustionMaterialBalance.theoreticalOxygenVolume *
          (1.498317949 +
            0.0001585 * packageExitTemperature +
            -4.77872e-7 * packageExitTemperature ** 2 +
            7.55826e-10 * packageExitTemperature ** 3 +
            -5.20124e-13 * packageExitTemperature ** 4 +
            1.33782e-16 * packageExitTemperature ** 5));

    const heatBalanceImbalance = Math.abs(
      ((heatBalanceAbsorption - heatTransferByEquation) * 100) /
        heatTransferByEquation,
    );

    const specificHeatTransferred =
      (lastHeatBalance.calculatedHourlyFuelConsumption *
        heatBalanceAbsorption) /
      firstConvectivePackageCharacteristics.convectivePackageHeatSurfaceArea;

    const convectivePackageHeatBalance =
      this.convectivePackageHeatBalanceRepository.create({
        convectivePackageId: 1,
        averageHeatAbsorptionCoefficient,
        sumAngularCoefficients,
        furnaceExitWindowArea,
        geometricAdjustmentFactor,
        screenWallBlacknessDegree,
        heatEfficiencyCoefficient,
        heatUtilizationCoefficient,
        packageExitTemperature,
        combustionProductEnthalpyExit,
        heatBalanceAbsorption,
        radiativeHeatLoad,
        heatReceivedByRadiation,
        enthalpyIncrease,
        heatedMediumTemperature,
        logarithmicTemperatureDifference,
        averageCombustionTemperature,
        averageCombustionVelocity,
        reynoldsCriterion,
        prandtlCriterion,
        correctionCoefficientCs,
        correctionCoefficientCz,
        convectiveHeatTransferCoefficient,
        threeAtomGasRayAttenuationCoefficient,
        radiativeLayerOpticalThickness,
        effectiveBlacknessDegree,
        averageWallTemperature,
        radiativeHeatTransferCoefficient,
        heatTransferCoefficient,
        heatTransferByEquation,
        exitTemperatureControlValue,
        heatBalanceImbalance,
        specificHeatTransferred,
      });

    return await this.convectivePackageHeatBalanceRepository.save(
      convectivePackageHeatBalance,
    );
  }

  async createSecondConvectivePackageHeatBalance() {
    const convectivePackageCharacteristics =
      await this.convectivePackageRepository.find({
        where: { packageNumber: 2 },
        order: { createdAt: 'DESC' },
        take: 1,
      });
    const SecondConvectivePackageCharacteristics =
      convectivePackageCharacteristics[0];
    const heatBalances = await this.heatBalanceRepository.find({
      order: { createdAt: 'DESC' },
      take: 1,
    });
    const alphaSecondConvectivePackageCombustionMaterialBalance =
      await this.combustionMaterialBalanceRepository.find({
        where: {
          airExcessCoefficient: { name: 'alphaConvectivePackage1' },
        },
        relations: ['airExcessCoefficient'],
        order: { createdAt: 'DESC' },
        take: 1,
      });
    const alphaSecondConvectiveAvgCombustionMaterialBalance =
      await this.combustionMaterialBalanceRepository.find({
        where: {
          airExcessCoefficient: { name: 'alphaConvectivePackage1Avg' },
        },
        relations: ['airExcessCoefficient'],
        order: { createdAt: 'DESC' },
        take: 1,
      });

    const furnaceHeatBalances = await this.furnaceHeatBalanceRepository.find({
      order: { createdAt: 'DESC' },
      take: 1,
    });

    const airLeakages = await this.airLeakageRepository.find({
      order: { createdAt: 'DESC' },
      take: 1,
    });
    const boilerCharacteristics =
      await this.boilerCharacteristicRepository.find({
        order: { createdAt: 'DESC' },
        take: 1,
      });

    const lastAlphaSecondAvgCombustionMaterialBalance =
      alphaSecondConvectiveAvgCombustionMaterialBalance[0];
    const lastBoilerCharacteristic = boilerCharacteristics[0];
    const lastAirLeakage = airLeakages[0];
    const lastFurnaceHeatBalance = furnaceHeatBalances[0];
    const lastHeatBalance = heatBalances[0];
    const lastAlphaSecondConvectivePackageCombustionMaterialBalance =
      alphaSecondConvectivePackageCombustionMaterialBalance[0];

    const averageHeatAbsorptionCoefficient = 0.7;
    const sumAngularCoefficients = 0.949;
    const furnaceExitWindowArea = 2.327;
    const geometricAdjustmentFactor = 1;
    const screenWallBlacknessDegree = 0.8;
    const heatEfficiencyCoefficient = 0.8;
    const heatUtilizationCoefficient = 0.95;
    const packageExitTemperature = 291.4;

    const combustionProductEnthalpyExit =
      (lastAlphaSecondConvectivePackageCombustionMaterialBalance.theoreticalCO2Volume *
        (1.604309582 +
          0.001133138 * packageExitTemperature +
          -8.60416e-7 * packageExitTemperature ** 2 +
          4.68441e-10 * packageExitTemperature ** 3 +
          -1.44713e-13 * packageExitTemperature ** 4 +
          1.82271e-17 * packageExitTemperature ** 5) +
        lastAlphaSecondConvectivePackageCombustionMaterialBalance.theoreticalWaterVaporVolume *
          (1.498317949 +
            0.000109232 * packageExitTemperature +
            -2.44654e-7 * packageExitTemperature ** 2 +
            2.46157e-10 * packageExitTemperature ** 3 +
            -1.56162e-13 * packageExitTemperature ** 4 +
            -5.57059e-18 * packageExitTemperature ** 5) +
        lastAlphaSecondConvectivePackageCombustionMaterialBalance.theoreticalOxygenVolume *
          (1.306450711 +
            0.000150251 * packageExitTemperature +
            1.72284e-7 * packageExitTemperature ** 2 +
            -2.32114e-10 * packageExitTemperature ** 3 +
            1.01527e-13 * packageExitTemperature ** 4 +
            -1.53025e-17 * packageExitTemperature ** 5) +
        lastAlphaSecondConvectivePackageCombustionMaterialBalance.theoreticalNitrogenVolume *
          (1.29747332 +
            -0.000010563 * packageExitTemperature +
            2.4181e-7 * packageExitTemperature ** 2 +
            -1.83389e-10 * packageExitTemperature ** 3 +
            5.85924e-14 * packageExitTemperature ** 4 +
            -7.03381e-18 * packageExitTemperature ** 5) +
        lastAlphaSecondConvectivePackageCombustionMaterialBalance.theoreticalSO2Volume *
          (0.607026715 +
            0.000308632 * packageExitTemperature +
            -1.5937e-7 * packageExitTemperature ** 2 +
            1.63367e-11 * packageExitTemperature ** 3 +
            1.25573e-14 * packageExitTemperature ** 4 +
            -3.03012e-18 * packageExitTemperature ** 5)) *
      packageExitTemperature;

    const heatBalanceAbsorption =
      lastHeatBalance.heatRetentionCoefficient *
      (lastFurnaceHeatBalance.combustionProductEnthalpyExit -
        combustionProductEnthalpyExit +
        lastAirLeakage.actualSecondConvectiveAirLeakage *
          lastHeatBalance.surroundingAirEnthalpy);

    const radiativeHeatLoad = 0;
    const heatReceivedByRadiation =
      (radiativeHeatLoad * furnaceExitWindowArea * sumAngularCoefficients) /
      lastHeatBalance.calculatedHourlyFuelConsumption;

    const enthalpyIncrease =
      ((heatBalanceAbsorption + heatReceivedByRadiation) *
        lastHeatBalance.calculatedHourlyFuelConsumption) /
      lastHeatBalance.heatedHeatCarrierFlow;
    const heatedMediumTemperature =
      14.46082904 +
      391.6645325 *
        (lastBoilerCharacteristic.excessPressureInBoiler + 0.1) ** 0.5 +
      -515.7577364 * (lastBoilerCharacteristic.excessPressureInBoiler + 0.1) +
      380.9431696 *
        (lastBoilerCharacteristic.excessPressureInBoiler + 0.1) ** 1.5 +
      -218.8244384 *
        (lastBoilerCharacteristic.excessPressureInBoiler + 0.1) ** 2 +
      40.22947271 *
        (lastBoilerCharacteristic.excessPressureInBoiler + 0.1) ** 2.5;

    const logarithmicTemperatureDifference =
      ((lastFurnaceHeatBalance.combustionProductExitTemperature -
        heatedMediumTemperature -
        (packageExitTemperature - heatedMediumTemperature)) *
        geometricAdjustmentFactor) /
      Math.log(
        (lastFurnaceHeatBalance.combustionProductExitTemperature -
          heatedMediumTemperature) /
          (packageExitTemperature - heatedMediumTemperature),
      );
    const averageCombustionTemperature =
      (lastFurnaceHeatBalance.combustionProductExitTemperature +
        packageExitTemperature) /
      2;

    const averageCombustionVelocity =
      (lastHeatBalance.calculatedHourlyFuelConsumption *
        lastAlphaSecondAvgCombustionMaterialBalance.totalWetCombustionProductsVolume *
        (averageCombustionTemperature + 273.15)) /
      (3600 *
        SecondConvectivePackageCharacteristics.channelCrossSectionArea *
        273.15);

    const reynoldsCriterion =
      (averageCombustionVelocity *
        SecondConvectivePackageCharacteristics.equivalentChannelDiameter) /
      (1.196865e-5 +
        2.791535e-8 * averageCombustionTemperature +
        -3.514694e-11 * averageCombustionTemperature ** 2 +
        2.273281e-14 * averageCombustionTemperature ** 3 +
        -7.561365e-18 * averageCombustionTemperature ** 4 +
        1.046736e-21 * averageCombustionTemperature ** 5);

    const prandtlCriterion =
      0.738892754 +
      1.5913e-4 * averageCombustionTemperature +
      -5.713939e-7 * averageCombustionTemperature ** 2 +
      1.035111e-9 * averageCombustionTemperature ** 3 +
      -1.1723e-12 * averageCombustionTemperature ** 4 +
      5.29942e-16 * averageCombustionTemperature ** 5;

    const correctionCoefficientCs =
      ((1 +
        (2 * SecondConvectivePackageCharacteristics.relativeTubePitchInRow -
          3) *
          (1 - SecondConvectivePackageCharacteristics.relativeRowPitch / 2)) **
        3) **
      -2;

    const correctionCoefficientCz = 1;
    const convectiveHeatTransferCoefficient =
      ((0.2 *
        (0.081620792 +
          0.000057156 * averageCombustionTemperature +
          -7.139937e-8 * averageCombustionTemperature ** 2 +
          9.573195e-11 * averageCombustionTemperature ** 3 +
          -1.042761e-13 * averageCombustionTemperature ** 4 +
          4.124561e-17 * averageCombustionTemperature ** 5)) /
        (SecondConvectivePackageCharacteristics.outerTubeDiameter * 0.001)) *
      reynoldsCriterion ** 0.65 *
      prandtlCriterion ** 0.33 *
      correctionCoefficientCs *
      correctionCoefficientCz;

    const threeAtomGasRayAttenuationCoefficient =
      ((7.8 +
        16 *
          lastAlphaSecondAvgCombustionMaterialBalance.specificVolumeFractionWaterVapor) /
        (3.16 *
          Math.sqrt(
            lastAlphaSecondAvgCombustionMaterialBalance.partialPressureTriatomicGases *
              SecondConvectivePackageCharacteristics.effectiveRadiatingLayerThickness,
          )) -
        1) *
      (1 - (0.37 * (packageExitTemperature + 273.15)) / 1000) *
      lastAlphaSecondAvgCombustionMaterialBalance.specificVolumeFractionTriatomicGases;

    const radiativeLayerOpticalThickness =
      threeAtomGasRayAttenuationCoefficient *
      lastBoilerCharacteristic.flueGasAbsolutePressure *
      SecondConvectivePackageCharacteristics.effectiveRadiatingLayerThickness;

    const effectiveBlacknessDegree =
      1 - Math.exp(-radiativeLayerOpticalThickness);

    const averageWallTemperature = heatedMediumTemperature + 25;

    const radiativeHeatTransferCoefficient =
      lastFurnaceHeatBalance.blackBodyRadiationCoefficient *
      (screenWallBlacknessDegree + 1) *
      0.5 *
      effectiveBlacknessDegree *
      (averageCombustionTemperature + 273.15) ** 3 *
      ((1 -
        ((averageWallTemperature + 273.15) /
          (averageCombustionTemperature + 273.15)) **
          3.6) /
        (1 -
          (averageWallTemperature + 273.15) /
            (averageCombustionTemperature + 273.15)));

    const heatTransferCoefficient =
      heatEfficiencyCoefficient *
      heatUtilizationCoefficient *
      (convectiveHeatTransferCoefficient + radiativeHeatTransferCoefficient);

    const heatTransferByEquation =
      (heatTransferCoefficient *
        SecondConvectivePackageCharacteristics.convectivePackageHeatSurfaceArea *
        logarithmicTemperatureDifference) /
      lastHeatBalance.calculatedHourlyFuelConsumption;

    const exitTemperatureControlValue =
      (lastFurnaceHeatBalance.combustionProductEnthalpyExit -
        heatTransferByEquation / lastHeatBalance.heatRetentionCoefficient +
        lastAirLeakage.actualSecondConvectiveAirLeakage *
          lastHeatBalance.surroundingAirEnthalpy) /
      (lastAlphaSecondConvectivePackageCombustionMaterialBalance.theoreticalCO2Volume *
        (1.604309582 +
          0.001133138 * packageExitTemperature +
          -8.60416e-7 * packageExitTemperature ** 2 +
          4.68441e-10 * packageExitTemperature ** 3 +
          -1.44713e-13 * packageExitTemperature ** 4 +
          1.82271e-17 * packageExitTemperature ** 5) +
        lastAlphaSecondConvectivePackageCombustionMaterialBalance.theoreticalSO2Volume *
          (0.607026715 +
            0.003008632 * packageExitTemperature +
            -1.5937e-7 * packageExitTemperature ** 2 +
            1.63637e-11 * packageExitTemperature ** 3 +
            -2.57357e-14 * packageExitTemperature ** 4 +
            -3.03012e-18 * packageExitTemperature ** 5) +
        lastAlphaSecondConvectivePackageCombustionMaterialBalance.theoreticalWaterVaporVolume *
          (1.306704025 +
            -6.71883e-6 * packageExitTemperature +
            2.59388e-7 * packageExitTemperature ** 2 +
            -1.60902e-10 * packageExitTemperature ** 3 +
            1.14164e-14 * packageExitTemperature ** 4 +
            1.04936e-17 * packageExitTemperature ** 5) +
        lastAlphaSecondConvectivePackageCombustionMaterialBalance.theoreticalNitrogenVolume *
          (1.306450711 +
            0.000150251 * packageExitTemperature +
            1.72284e-7 * packageExitTemperature ** 2 +
            -2.32114e-10 * packageExitTemperature ** 3 +
            1.01527e-13 * packageExitTemperature ** 4 +
            -1.53025e-17 * packageExitTemperature ** 5) +
        lastAlphaSecondConvectivePackageCombustionMaterialBalance.theoreticalOxygenVolume *
          (1.498317949 +
            0.0001585 * packageExitTemperature +
            -4.77872e-7 * packageExitTemperature ** 2 +
            7.55826e-10 * packageExitTemperature ** 3 +
            -5.20124e-13 * packageExitTemperature ** 4 +
            1.33782e-16 * packageExitTemperature ** 5));

    const heatBalanceImbalance = Math.abs(
      ((heatBalanceAbsorption - heatTransferByEquation) * 100) /
        heatTransferByEquation,
    );

    const specificHeatTransferred =
      (lastHeatBalance.calculatedHourlyFuelConsumption *
        heatBalanceAbsorption) /
      SecondConvectivePackageCharacteristics.convectivePackageHeatSurfaceArea;

    const convectivePackageHeatBalance =
      this.convectivePackageHeatBalanceRepository.create({
        convectivePackageId: 2,
        averageHeatAbsorptionCoefficient,
        sumAngularCoefficients,
        furnaceExitWindowArea,
        geometricAdjustmentFactor,
        screenWallBlacknessDegree,
        heatEfficiencyCoefficient,
        heatUtilizationCoefficient,
        packageExitTemperature,
        combustionProductEnthalpyExit,
        heatBalanceAbsorption,
        radiativeHeatLoad,
        heatReceivedByRadiation,
        enthalpyIncrease,
        heatedMediumTemperature,
        logarithmicTemperatureDifference,
        averageCombustionTemperature,
        averageCombustionVelocity,
        reynoldsCriterion,
        prandtlCriterion,
        correctionCoefficientCs,
        correctionCoefficientCz,
        convectiveHeatTransferCoefficient,
        threeAtomGasRayAttenuationCoefficient,
        radiativeLayerOpticalThickness,
        effectiveBlacknessDegree,
        averageWallTemperature,
        radiativeHeatTransferCoefficient,
        heatTransferCoefficient,
        heatTransferByEquation,
        exitTemperatureControlValue,
        heatBalanceImbalance,
        specificHeatTransferred,
      });
    return await this.convectivePackageHeatBalanceRepository.save(
      convectivePackageHeatBalance,
    );
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
