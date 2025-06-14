import { Injectable } from '@nestjs/common';
import { CalculateFurnaceCharacteristicsParams } from './interfaces';
import { FurnaceCharacteristic } from './entities';

@Injectable()
export class FurnaceCharacteristicsService {
  public async calculate(params: CalculateFurnaceCharacteristicsParams) {
    const furnaceCharacteristic = new FurnaceCharacteristic({
      ...params.createFurnaceCharacteristicDto,
    });
    return furnaceCharacteristic;
  }
}
