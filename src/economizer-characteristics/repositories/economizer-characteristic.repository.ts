import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { EconomizerCharacteristic } from '../entities';

@Injectable()
export class EconomizerCharacteristicRepository extends Repository<EconomizerCharacteristic> {
  public constructor(private _dataSource: DataSource) {
    super(EconomizerCharacteristic, _dataSource.createEntityManager());
  }
}
