import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { TemperatureCharacteristic } from '../entities';

@Injectable()
export class TemperatureCharacteristicRepository extends Repository<TemperatureCharacteristic> {
  public constructor(private _dataSource: DataSource) {
    super(TemperatureCharacteristic, _dataSource.createEntityManager());
  }
}
