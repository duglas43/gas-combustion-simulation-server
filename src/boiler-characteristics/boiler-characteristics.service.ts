import { Injectable } from '@nestjs/common';
import { CreateBoilerCharacteristicDto } from './dtos';
import { BoilerCharacteristic } from './entities';

@Injectable()
export class BoilerCharacteristicsService {
  public calculate(dto: CreateBoilerCharacteristicDto) {
    const { nominalSteamProduction, loadPercentage } = dto;
    const boilerCharacteristic = new BoilerCharacteristic({
      ...dto,
      actualSteamProduction: (nominalSteamProduction * loadPercentage) / 100,
    });
    return boilerCharacteristic;
  }
}
