import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { HeatBalance } from '../entities';

@Injectable()
export class HeatBalanceRepository extends Repository<HeatBalance> {
  public constructor(private _dataSource: DataSource) {
    super(HeatBalance, _dataSource.createEntityManager());
  }
}
