import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { AirExcessCoefficient } from '../entities';

@Injectable()
export class AirExcessCoefficientRepository extends Repository<AirExcessCoefficient> {
  public constructor(private _dataSource: DataSource) {
    super(AirExcessCoefficient, _dataSource.createEntityManager());
  }
}
