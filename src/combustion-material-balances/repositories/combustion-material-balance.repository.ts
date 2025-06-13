import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CombustionMaterialBalance } from '../entities';

@Injectable()
export class CombustionMaterialBalanceRepository extends Repository<CombustionMaterialBalance> {
  public constructor(private _dataSource: DataSource) {
    super(CombustionMaterialBalance, _dataSource.createEntityManager());
  }
}
