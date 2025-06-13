import { Injectable } from '@nestjs/common';
import { BoilerCharacteristicRepository } from './repositories';
import { CreateBoilerCharacteristicDto } from './dtos';

@Injectable()
export class BoilerCharacteristicsService {
  constructor(
    private readonly boilerCharacteristicRepository: BoilerCharacteristicRepository,
  ) {}

  public async calculate(dto: CreateBoilerCharacteristicDto) {
    const { nominalSteamProduction, loadPercentage } = dto;
    const boilerCharacteristic = this.boilerCharacteristicRepository.create({
      ...dto,
      actualSteamProduction: (nominalSteamProduction * loadPercentage) / 100,
    });
    return boilerCharacteristic;
  }
}
