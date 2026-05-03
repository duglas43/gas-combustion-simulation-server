import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { StateSnapshot } from '../entities';

@Injectable()
export class StateSnapshotRepository extends Repository<StateSnapshot> {
  constructor(private dataSource: DataSource) {
    super(StateSnapshot, dataSource.createEntityManager());
  }
}
