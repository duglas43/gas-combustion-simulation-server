import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { FurnaceHeatBalance } from '../entities';

@Injectable()
export class FurnaceHeatBalanceRepository extends Repository<FurnaceHeatBalance> {
  public constructor(private _dataSource: DataSource) {
    super(FurnaceHeatBalance, _dataSource.createEntityManager());
  }
}
