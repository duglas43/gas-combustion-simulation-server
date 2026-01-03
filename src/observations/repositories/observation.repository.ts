import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Observation } from '../entities';

@Injectable()
export class ObservationRepository extends Repository<Observation> {
  constructor(private dataSource: DataSource) {
    super(Observation, dataSource.createEntityManager());
  }
}
