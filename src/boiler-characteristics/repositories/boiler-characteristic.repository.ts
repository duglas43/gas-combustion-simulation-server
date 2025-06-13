import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { BoilerCharacteristic } from '../entities';

@Injectable()
export class BoilerCharacteristicRepository extends Repository<BoilerCharacteristic> {
  public constructor(private _dataSource: DataSource) {
    super(BoilerCharacteristic, _dataSource.createEntityManager());
  }
}
