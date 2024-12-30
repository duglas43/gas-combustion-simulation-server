import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class AirLeakage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  actualFurnaceAirLeakage: number;

  @Column({ type: 'float' })
  nominalFurnaceAirLeakage: number;

  @Column({ type: 'float' })
  actualFirstConvectiveAirLeakage: number;

  @Column({ type: 'float' })
  nominalFirstConvectiveAirLeakage: number;

  @Column({ type: 'float' })
  actualSecondConvectiveAirLeakage: number;

  @Column({ type: 'float' })
  nominalSecondConvectiveAirLeakage: number;

  @Column({ type: 'float' })
  actualEconomizerAirLeakage: number;

  @Column({ type: 'float' })
  nominalEconomizerAirLeakage: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
