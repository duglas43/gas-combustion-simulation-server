import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CombustionMaterialBalanceTemperature } from '../entities';

@Injectable()
export class CombustionMaterialBalanceTemperatureRepository extends Repository<CombustionMaterialBalanceTemperature> {
  public constructor(private _dataSource: DataSource) {
    super(
      CombustionMaterialBalanceTemperature,
      _dataSource.createEntityManager(),
    );
  }
}
