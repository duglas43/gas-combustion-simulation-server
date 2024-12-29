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
}
