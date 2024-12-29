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

  @Column()
  actualFurnaceAirLeakage: number;

  @Column()
  nominalFurnaceAirLeakage: number;

  @Column()
  actualFirstConvectiveAirLeakage: number;

  @Column()
  nominalFirstConvectiveAirLeakage: number;

  @Column()
  actualSecondConvectiveAirLeakage: number;

  @Column()
  nominalSecondConvectiveAirLeakage: number;

  @Column()
  actualThirdConvectiveAirLeakage: number;

  @Column()
  nominalThirdConvectiveAirLeakage: number;

  @Column()
  actualEconomizerAirLeakage: number;

  @Column()
  nominalEconomizerAirLeakage: number;

  @Column()
  actualAirPreheaterLeakage: number;

  @Column()
  nominalAirPreheaterLeakage: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
