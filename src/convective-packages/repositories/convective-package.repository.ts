import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ConvectivePackage } from '../entities';

@Injectable()
export class ConvectivePackageRepository extends Repository<ConvectivePackage> {
  public constructor(private _dataSource: DataSource) {
    super(ConvectivePackage, _dataSource.createEntityManager());
  }
}
