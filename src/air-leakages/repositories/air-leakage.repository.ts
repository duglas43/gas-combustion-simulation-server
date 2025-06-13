import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { AirLeakage } from '../entities';

@Injectable()
export class AirLeakageRepository extends Repository<AirLeakage> {
  public constructor(private _dataSource: DataSource) {
    super(AirLeakage, _dataSource.createEntityManager());
  }
}
