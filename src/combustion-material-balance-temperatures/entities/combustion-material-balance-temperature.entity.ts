import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class CombustionMaterialBalanceTemperature {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  lowerHeatingValue: number;

  @Column({ type: 'float' })
  higherHeatingValue: number;

  @Column({ type: 'float' })
  theoreticalDryAirConsumption: number;

  @Column({ type: 'float' })
  theoreticalWetAirConsumption: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
