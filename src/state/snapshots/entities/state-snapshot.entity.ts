import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Laws } from 'src/laws/entities';
import { State } from 'src/state/entities';

@Entity({ name: 'state_snapshots' })
export class StateSnapshot {
  @PrimaryColumn()
  time: Date;

  @Column({ type: 'bigint', unique: true })
  timestamp: number;

  @Column({ type: 'jsonb' })
  state: State;

  @Column({ type: 'jsonb', nullable: true })
  laws?: Laws;
}
