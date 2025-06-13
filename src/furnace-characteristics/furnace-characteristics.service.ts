import { Injectable } from '@nestjs/common';
import { FurnaceCharacteristicRepository } from './repositories';
import { CalculateFurnaceCharacteristicsParams } from './interfaces';

@Injectable()
export class FurnaceCharacteristicsService {
  constructor(
    private readonly furnaceCharacteristicRepository: FurnaceCharacteristicRepository,
  ) {}

  public async calculate(params: CalculateFurnaceCharacteristicsParams) {
    const furnaceCharacteristic = this.furnaceCharacteristicRepository.create({
      ...params.createFurnaceCharacteristicDto,
    });
    return furnaceCharacteristic;
  }
}
