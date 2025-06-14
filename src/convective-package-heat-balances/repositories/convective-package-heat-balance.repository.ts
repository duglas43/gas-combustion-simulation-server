import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ConvectivePackageHeatBalance } from '../entities';

@Injectable()
export class ConvectivePackageHeatBalanceRepository extends Repository<ConvectivePackageHeatBalance> {
  public constructor(private _dataSource: DataSource) {
    super(ConvectivePackageHeatBalance, _dataSource.createEntityManager());
  }
}
