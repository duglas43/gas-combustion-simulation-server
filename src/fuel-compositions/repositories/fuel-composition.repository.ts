import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { FuelComposition } from '../entities';

@Injectable()
export class FuelCompositionRepository extends Repository<FuelComposition> {
  public constructor(private _dataSource: DataSource) {
    super(FuelComposition, _dataSource.createEntityManager());
  }
}
