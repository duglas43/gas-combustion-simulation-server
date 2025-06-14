import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { EconomizerHeatBalance } from '../entities';

@Injectable()
export class EconomizerHeatBalanceRepository extends Repository<EconomizerHeatBalance> {
  public constructor(private _dataSource: DataSource) {
    super(EconomizerHeatBalance, _dataSource.createEntityManager());
  }
}
