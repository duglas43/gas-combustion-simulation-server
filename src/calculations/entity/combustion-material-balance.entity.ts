import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AirExcessCoefficient } from './air-excess-coefficient.entity';

@Entity()
export class CombustionMaterialBalance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  airExcessCoefficientId: number;

  @ManyToOne(() => AirExcessCoefficient, { onDelete: 'CASCADE' })
  @JoinColumn()
  airExcessCoefficient: AirExcessCoefficient;

  @Column({ type: 'float' })
  actualWetAirConsumption: number;

  @Column({ type: 'float' })
  theoreticalCO2Volume: number;

  @Column({ type: 'float' })
  theoreticalSO2Volume: number;

  @Column({ type: 'float' })
  theoreticalWaterVaporVolume: number;

  @Column({ type: 'float' })
  theoreticalNitrogenVolume: number;

  @Column({ type: 'float' })
  theoreticalOxygenVolume: number;

  @Column({ type: 'float' })
  totalWetCombustionProductsVolume: number;

  @Column({ type: 'float' })
  specificVolumeFractionRO2: number;

  @Column({ type: 'float' })
  specificVolumeFractionWaterVapor: number;

  @Column({ type: 'float' })
  specificVolumeFractionTriatomicGases: number;

  @Column({ type: 'float' })
  partialPressureRO2: number;

  @Column({ type: 'float' })
  partialPressureWaterVapor: number;

  @Column({ type: 'float' })
  partialPressureTriatomicGases: number;

  @Column({ type: 'float' })
  recirculationRate: number;

  @Column({ type: 'float' })
  specificMassOfCombustionProducts: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
