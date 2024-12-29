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
}
