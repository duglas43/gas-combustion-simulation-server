import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { FurnaceCharacteristic } from '../entities';

@Injectable()
export class FurnaceCharacteristicRepository extends Repository<FurnaceCharacteristic> {
  public constructor(private _dataSource: DataSource) {
    super(FurnaceCharacteristic, _dataSource.createEntityManager());
  }
}
