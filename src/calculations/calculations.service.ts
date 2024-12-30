import { Injectable } from '@nestjs/common';
import { CreateCalculationDto } from './dto/create-calculation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EconomizerCharacteristic } from './entity/economizer-characteristic.entity';
import { AirLeakage } from './entity/air-leakage.entity';
import { AirExcessCoefficient } from './entity/air-excess-coefficient.entity';
import { BoilerCharacteristic } from './entity/boiler-characteristic.entity';
import { CombustionMaterialBalance } from './entity/combustion-material-balance.entity';
import { CombustionMaterialBalanceTemperature } from './entity/combustion-material-balance-temperature.entity';
import { ConvectivePackage } from './entity/convective-package.entity';
import { ConvectivePackageHeatBalance } from './entity/convective-package-heat-balance.entity';
import { EconomizerHeatBalance } from './entity/economizer-heat-balance.entity';
import { FuelComposition } from './entity/fuel-composition.entity';
import { FurnaceCharacteristic } from './entity/furnace-characteristic.entity';
import { FurnaceHeatBalance } from './entity/furnace-heat-balance.entity';
import { HeatBalance } from './entity/heat-balance.entity';
import { TemperatureCharacteristic } from './entity/temperature-characteristic.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CalculationsService {
  constructor(
    @InjectRepository(EconomizerCharacteristic)
    private economizerCharacteristicRepository: Repository<EconomizerCharacteristic>,
    @InjectRepository(AirLeakage)
    private airLeakageRepository: Repository<AirLeakage>,
    @InjectRepository(AirExcessCoefficient)
    private airExcessCoefficientRepository: Repository<AirExcessCoefficient>,
    @InjectRepository(BoilerCharacteristic)
    private boilerCharacteristicRepository: Repository<BoilerCharacteristic>,
    @InjectRepository(CombustionMaterialBalance)
    private combustionMaterialBalanceRepository: Repository<CombustionMaterialBalance>,
    @InjectRepository(CombustionMaterialBalanceTemperature)
    private combustionMaterialBalanceTemperatureRepository: Repository<CombustionMaterialBalanceTemperature>,
    @InjectRepository(ConvectivePackage)
    private convectivePackageRepository: Repository<ConvectivePackage>,
    @InjectRepository(ConvectivePackageHeatBalance)
    private convectivePackageHeatBalanceRepository: Repository<ConvectivePackageHeatBalance>,
    @InjectRepository(EconomizerHeatBalance)
    private economizerHeatBalanceRepository: Repository<EconomizerHeatBalance>,
    @InjectRepository(FuelComposition)
    private fuelCompositionRepository: Repository<FuelComposition>,
    @InjectRepository(FurnaceCharacteristic)
    private furnaceCharacteristicRepository: Repository<FurnaceCharacteristic>,
    @InjectRepository(FurnaceHeatBalance)
    private furnaceHeatBalanceRepository: Repository<FurnaceHeatBalance>,
    @InjectRepository(HeatBalance)
    private heatBalanceRepository: Repository<HeatBalance>,
    @InjectRepository(TemperatureCharacteristic)
    private temperatureCharacteristicRepository: Repository<TemperatureCharacteristic>,
  ) {}

  async create(dto: CreateCalculationDto) {
    await this.createBoilerCharacteristic(dto);
    await this.createFuelComposition(dto);
    await this.createFurnaceCharacteristic(dto);
    await this.createConvectivePackages(dto);
    await this.createAirLeakage();
    await this.createTemperatureCharacteristic();
    await this.createCombustionMaterialBalanceTemperature();
    await this.createAirExcessCoefficients();
    return 'Ok';
  }

  async createBoilerCharacteristic(dto: CreateCalculationDto) {
    const { nominalSteamProduction, loadPercentage } =
      dto.boilerCharacteristics;

    const boilerCharacteristic = this.boilerCharacteristicRepository.create({
      ...dto.boilerCharacteristics,
      actualSteamProduction: (nominalSteamProduction * loadPercentage) / 100,
    });

    return await this.boilerCharacteristicRepository.save(boilerCharacteristic);
  }

  async createFuelComposition(dto: CreateCalculationDto) {
    const boilerCharacteristics =
      await this.boilerCharacteristicRepository.find({
        order: { createdAt: 'DESC' },
      });
    const lastBoilerCharacteristic = boilerCharacteristics[0];
    const { gasInletTemperature } = lastBoilerCharacteristic;
    const fuelComposition = this.fuelCompositionRepository.create({
      ...dto.fuelComposition,
      methaneHeatCapacity:
        1.54908042 +
        0.000719365 * gasInletTemperature +
        2.43134e-6 * gasInletTemperature ** 2 +
        -4.79443e-9 * gasInletTemperature ** 3 +
        4.30216e-12 * gasInletTemperature ** 4 +
        -1.50641e-15 * gasInletTemperature ** 5,
      ethaneHeatCapacity:
        2.211388112 +
        0.002810953 * gasInletTemperature +
        3.15253e-7 * gasInletTemperature ** 2 +
        -1.58086e-9 * gasInletTemperature ** 3 +
        9.33858e-13 * gasInletTemperature ** 4 +
        -1.60256e-16 * gasInletTemperature ** 5,
      propaneHeatCapacity:
        3.046305944 +
        0.004794336 * gasInletTemperature +
        -9.4705e-7 * gasInletTemperature ** 2 +
        -1.29975e-9 * gasInletTemperature ** 3 +
        1.13855e-12 * gasInletTemperature ** 4 +
        -2.72436e-16 * gasInletTemperature ** 5,
      nButaneHeatCapacity:
        4.127592657 +
        0.005936645 * gasInletTemperature +
        -1.4782e-6 * gasInletTemperature ** 2 +
        2.76005e-10 * gasInletTemperature ** 3 +
        -1.34105e-12 * gasInletTemperature ** 4 +
        8.8141e-16 * gasInletTemperature ** 5,
      isoButaneHeatCapacity:
        5.12743007 +
        0.00744045 * gasInletTemperature +
        -3.30121e-6 * gasInletTemperature ** 2 +
        4.42177e-9 * gasInletTemperature ** 3 +
        -6.1961e-12 * gasInletTemperature ** 4 +
        2.85256e-15 * gasInletTemperature ** 5,
      pentaneHeatCapacity:
        5.12743007 +
        0.00744045 * gasInletTemperature +
        -3.30121e-6 * gasInletTemperature ** 2 +
        4.42177e-9 * gasInletTemperature ** 3 +
        -6.1961e-12 * gasInletTemperature ** 4 +
        2.85256e-15 * gasInletTemperature ** 5,
      hydrogenHeatCapacity:
        1.285314861 +
        0.0001585 * gasInletTemperature +
        -4.77872e-7 * gasInletTemperature ** 2 +
        7.55826e-10 * gasInletTemperature ** 3 +
        -5.20124e-13 * gasInletTemperature ** 4 +
        1.33782e-16 * gasInletTemperature ** 5,
      ethyleneHeatCapacity:
        1.834188112 +
        0.002810953 * gasInletTemperature +
        3.15253e-7 * gasInletTemperature ** 2 +
        -1.58086e-9 * gasInletTemperature ** 3 +
        9.33858e-13 * gasInletTemperature ** 4 +
        -1.60256e-16 * gasInletTemperature ** 5,
      propyleneHeatCapacity:
        2.738305944 +
        0.004794336 * gasInletTemperature +
        -9.4705e-7 * gasInletTemperature ** 2 +
        -1.29975e-9 * gasInletTemperature ** 3 +
        1.13855e-12 * gasInletTemperature ** 4 +
        -2.72436e-16 * gasInletTemperature ** 5,
      acetyleneHeatCapacity:
        1.925388112 +
        0.002810953 * gasInletTemperature +
        3.15253e-7 * gasInletTemperature ** 2 +
        -1.58086e-9 * gasInletTemperature ** 3 +
        9.33858e-13 * gasInletTemperature ** 4 +
        -1.60256e-16 * gasInletTemperature ** 5,
      carbonDioxideHeatCapacity:
        1.604309582 +
        0.001133138 * gasInletTemperature +
        -8.60416e-7 * gasInletTemperature ** 2 +
        4.68441e-10 * gasInletTemperature ** 3 +
        -1.44713e-13 * gasInletTemperature ** 4 +
        1.82271e-17 * gasInletTemperature ** 5,
      carbonMonoxideHeatCapacity:
        1.306704025 +
        -6.71883e-6 * gasInletTemperature +
        2.59388e-7 * gasInletTemperature ** 2 +
        -1.60902e-10 * gasInletTemperature ** 3 +
        1.14164e-14 * gasInletTemperature ** 4 +
        1.04936e-17 * gasInletTemperature ** 5,
      nitrogenHeatCapacity:
        1.29747332 +
        -0.000010563 * gasInletTemperature +
        2.4181e-7 * gasInletTemperature ** 2 +
        -1.83389e-10 * gasInletTemperature ** 3 +
        5.85924e-14 * gasInletTemperature ** 4 +
        -7.03381e-18 * gasInletTemperature ** 5,
      oxygenHeatCapacity:
        1.306450711 +
        0.000150251 * gasInletTemperature +
        1.72284e-7 * gasInletTemperature ** 2 +
        -2.32114e-10 * gasInletTemperature ** 3 +
        1.01527e-13 * gasInletTemperature ** 4 +
        -1.53025e-17 * gasInletTemperature ** 5,
      hydrogenSulfideHeatCapacity:
        1.507006993 +
        0.000224906 * gasInletTemperature +
        2.55915e-7 * gasInletTemperature ** 2 +
        -1.1655e-11 * gasInletTemperature ** 3 +
        -2.53497e-13 * gasInletTemperature ** 4 +
        1.28205e-16 * gasInletTemperature ** 5,
      butyleneHeatCapacity:
        3.789592657 +
        0.005936645 * gasInletTemperature +
        -1.4782e-6 * gasInletTemperature ** 2 +
        2.76005e-10 * gasInletTemperature ** 3 +
        -1.34105e-12 * gasInletTemperature ** 4 +
        8.8141e-16 * gasInletTemperature ** 5,
    });
    await this.fuelCompositionRepository.save(fuelComposition);
  }

  async createFurnaceCharacteristic(dto: CreateCalculationDto) {
    const furnaceCharacteristic = this.furnaceCharacteristicRepository.create({
      ...dto.furnaceCharacteristics,
    });
    return await this.furnaceCharacteristicRepository.save(
      furnaceCharacteristic,
    );
  }

  async createConvectivePackages(dto: CreateCalculationDto) {
    for (const convectivePackage of dto.convectivePackagesParameters) {
      const relativeTubePitchInRow =
        convectivePackage.tubePitchInRow / convectivePackage.outerTubeDiameter;
      const relativeRowPitch =
        convectivePackage.rowPitch / convectivePackage.outerTubeDiameter;
      const effectiveRadiatingLayerThickness =
        0.9 *
        convectivePackage.outerTubeDiameter *
        0.001 *
        ((4 * relativeTubePitchInRow * relativeRowPitch) / Math.PI - 1);
      const convectivePackageHeatSurfaceArea =
        Math.PI *
        convectivePackage.outerTubeDiameter *
        0.001 *
        convectivePackage.averageTubeLength *
        convectivePackage.numberOfRows *
        convectivePackage.tubesPerRow;
      const totalNumberOfTubes =
        convectivePackage.tubesPerRow * convectivePackage.numberOfRows;
      const channelCrossSectionArea =
        convectivePackage.minCrossSectionDimension *
          convectivePackage.maxCrossSectionDimension -
        convectivePackage.outerTubeDiameter *
          0.001 *
          convectivePackage.averageTubeLength *
          convectivePackage.tubesPerRow;
      const equivalentChannelDiameter =
        (4 * channelCrossSectionArea) /
        ((convectivePackage.minCrossSectionDimension -
          convectivePackage.outerTubeDiameter *
            0.001 *
            convectivePackage.tubesPerRow) *
          2 +
          2.6 * (convectivePackage.tubesPerRow * 2 + 2));

      const convectivePackageEntity = this.convectivePackageRepository.create({
        ...convectivePackage,
        id: convectivePackage.id,
        relativeTubePitchInRow,
        relativeRowPitch,
        effectiveRadiatingLayerThickness,
        convectivePackageHeatSurfaceArea,
        totalNumberOfTubes,
        channelCrossSectionArea,
        equivalentChannelDiameter,
      });
      await this.convectivePackageRepository.save(convectivePackageEntity);
    }
  }

  async createAirLeakage() {
    const boilerCharacteristics =
      await this.boilerCharacteristicRepository.find({
        order: { createdAt: 'DESC' },
      });
    const lastBoilerCharacteristic = boilerCharacteristics[0];
    const { nominalSteamProduction, actualSteamProduction } =
      lastBoilerCharacteristic;
    const airLeakage = this.airLeakageRepository.create({
      nominalFurnaceAirLeakage: 0.05,
      actualFurnaceAirLeakage:
        0.05 * (nominalSteamProduction / actualSteamProduction),
      nominalFirstConvectiveAirLeakage: 0.05,
      actualFirstConvectiveAirLeakage:
        0.05 * (nominalSteamProduction / actualSteamProduction) ** 0.5,
      nominalSecondConvectiveAirLeakage: 0.1,
      actualSecondConvectiveAirLeakage:
        0.1 * (nominalSteamProduction / actualSteamProduction) ** 0.5,
      nominalEconomizerAirLeakage: 0.1,
      actualEconomizerAirLeakage:
        0.1 * (nominalSteamProduction / actualSteamProduction) ** 0.5,
    });
    return await this.airLeakageRepository.save(airLeakage);
  }

  async createTemperatureCharacteristic() {
    const fuelComposition = await this.fuelCompositionRepository.find({
      order: { createdAt: 'DESC' },
    });
    const lastFuelComposition = fuelComposition[0];

    const boilerCharacteristics =
      await this.boilerCharacteristicRepository.find({
        order: { createdAt: 'DESC' },
      });
    const lastBoilerCharacteristic = boilerCharacteristics[0];

    const temperatureCharacteristic =
      this.temperatureCharacteristicRepository.create({
        recirculationRate: 0,
        combustionAirTemperature: lastBoilerCharacteristic.roomAirTemperature,
        gasMixtureHeatCapacity:
          (lastFuelComposition.methanePercentage *
            lastFuelComposition.methaneHeatCapacity +
            lastFuelComposition.ethanePercentage *
              lastFuelComposition.ethaneHeatCapacity +
            lastFuelComposition.propanePercentage *
              lastFuelComposition.propaneHeatCapacity +
            lastFuelComposition.nButanePercentage *
              lastFuelComposition.nButaneHeatCapacity +
            lastFuelComposition.isoButanePercentage *
              lastFuelComposition.isoButaneHeatCapacity +
            lastFuelComposition.pentanePercentage *
              lastFuelComposition.pentaneHeatCapacity +
            lastFuelComposition.hydrogenPercentage *
              lastFuelComposition.hydrogenHeatCapacity +
            lastFuelComposition.ethylenePercentage *
              lastFuelComposition.ethyleneHeatCapacity +
            lastFuelComposition.propylenePercentage *
              lastFuelComposition.propyleneHeatCapacity +
            lastFuelComposition.butylenePercentage *
              lastFuelComposition.butyleneHeatCapacity +
            lastFuelComposition.acetylenePercentage *
              lastFuelComposition.acetyleneHeatCapacity +
            lastFuelComposition.hydrogenSulfidePercentage *
              lastFuelComposition.hydrogenSulfideHeatCapacity +
            lastFuelComposition.carbonMonoxidePercentage *
              lastFuelComposition.carbonMonoxideHeatCapacity +
            lastFuelComposition.carbonDioxidePercentage *
              lastFuelComposition.carbonDioxideHeatCapacity +
            lastFuelComposition.nitrogenPercentage *
              lastFuelComposition.nitrogenHeatCapacity +
            lastFuelComposition.oxygenPercentage *
              lastFuelComposition.oxygenHeatCapacity) /
          100,
        boilerRoomAirHeatCapacity:
          1.323305621 +
          2.32677e-5 * lastBoilerCharacteristic.roomAirTemperature +
          2.40222e-7 * lastBoilerCharacteristic.roomAirTemperature ** 2 +
          -2.12806e-10 * lastBoilerCharacteristic.roomAirTemperature ** 3 +
          7.96863e-14 * lastBoilerCharacteristic.roomAirTemperature ** 4 +
          -1.14303e-17 * lastBoilerCharacteristic.roomAirTemperature ** 5,
        combustionAirHeatCapacity:
          1.323305621 +
          2.32677e-5 * lastBoilerCharacteristic.roomAirTemperature +
          2.40222e-7 * lastBoilerCharacteristic.roomAirTemperature ** 2 +
          -2.12806e-10 * lastBoilerCharacteristic.roomAirTemperature ** 3 +
          7.96863e-14 * lastBoilerCharacteristic.roomAirTemperature ** 4 +
          -1.14303e-17 * lastBoilerCharacteristic.roomAirTemperature ** 5,
      });
    return await this.temperatureCharacteristicRepository.save(
      temperatureCharacteristic,
    );
  }

  async createCombustionMaterialBalanceTemperature() {
    const fuelComposition = await this.fuelCompositionRepository.find({
      order: { createdAt: 'DESC' },
    });
    const lastFuelComposition = fuelComposition[0];
    const boilerCharacteristics =
      await this.boilerCharacteristicRepository.find({
        order: { createdAt: 'DESC' },
      });
    const lastBoilerCharacteristic = boilerCharacteristics[0];

    const lowerHeatingValue =
      0.01 *
      (10790 * lastFuelComposition.hydrogenPercentage +
        12640 * lastFuelComposition.carbonMonoxidePercentage +
        35880 * lastFuelComposition.methanePercentage +
        64300 * lastFuelComposition.ethanePercentage +
        93180 * lastFuelComposition.propanePercentage +
        123500 * lastFuelComposition.nButanePercentage +
        122700 * lastFuelComposition.isoButanePercentage +
        156600 * lastFuelComposition.pentanePercentage +
        59500 * lastFuelComposition.acetylenePercentage +
        88400 * lastFuelComposition.propylenePercentage +
        113800 * lastFuelComposition.butylenePercentage);

    const higherHeatingValue =
      0.01 *
      (12750 * lastFuelComposition.hydrogenPercentage +
        12640 * lastFuelComposition.carbonMonoxidePercentage +
        39800 * lastFuelComposition.methanePercentage +
        70300 * lastFuelComposition.ethanePercentage +
        101200 * lastFuelComposition.propanePercentage +
        113800 * lastFuelComposition.nButanePercentage +
        132900 * lastFuelComposition.isoButanePercentage +
        169300 * lastFuelComposition.pentanePercentage +
        36000 * lastFuelComposition.acetylenePercentage +
        91900 * lastFuelComposition.propylenePercentage +
        121400 * lastFuelComposition.butylenePercentage);

    const theoreticalDryAirConsumption =
      0.0476 *
      (2 * lastFuelComposition.methanePercentage +
        3.5 * lastFuelComposition.ethanePercentage +
        5 * lastFuelComposition.propanePercentage +
        6.5 *
          (lastFuelComposition.nButanePercentage +
            lastFuelComposition.isoButanePercentage) +
        8 * lastFuelComposition.pentanePercentage +
        0.5 * lastFuelComposition.hydrogenPercentage +
        3 * lastFuelComposition.acetylenePercentage +
        4.5 * lastFuelComposition.propylenePercentage +
        6 * lastFuelComposition.butylenePercentage +
        2.5 * lastFuelComposition.carbonMonoxidePercentage -
        0.01 * lastFuelComposition.oxygenPercentage);
    const theoreticalWetAirConsumption =
      theoreticalDryAirConsumption +
      0.00124 *
        lastBoilerCharacteristic.airHumidityForCombustion *
        theoreticalDryAirConsumption;

    const combustionMaterialBalanceTemperature =
      this.combustionMaterialBalanceTemperatureRepository.create({
        lowerHeatingValue,
        higherHeatingValue,
        theoreticalDryAirConsumption,
        theoreticalWetAirConsumption,
      });
    return await this.combustionMaterialBalanceTemperatureRepository.save(
      combustionMaterialBalanceTemperature,
    );
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
}
