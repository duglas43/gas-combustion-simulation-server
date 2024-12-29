import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class FuelComposition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  methanePercentage: number;

  @Column({ type: 'float' })
  methaneHeatCapacity: number;

  @Column({ type: 'float' })
  ethanePercentage: number;

  @Column({ type: 'float' })
  ethaneHeatCapacity: number;

  @Column({ type: 'float' })
  propanePercentage: number;

  @Column({ type: 'float' })
  propaneHeatCapacity: number;

  @Column({ type: 'float' })
  nButanePercentage: number;

  @Column({ type: 'float' })
  nButaneHeatCapacity: number;

  @Column({ type: 'float' })
  isoButanePercentage: number;

  @Column({ type: 'float' })
  isoButaneHeatCapacity: number;

  @Column({ type: 'float' })
  pentanePercentage: number;

  @Column({ type: 'float' })
  pentaneHeatCapacity: number;

  @Column({ type: 'float' })
  hydrogenPercentage: number;

  @Column({ type: 'float' })
  hydrogenHeatCapacity: number;

  @Column({ type: 'float' })
  ethylenePercentage: number;

  @Column({ type: 'float' })
  ethyleneHeatCapacity: number;

  @Column({ type: 'float' })
  propylenePercentage: number;

  @Column({ type: 'float' })
  propyleneHeatCapacity: number;

  @Column({ type: 'float' })
  butylenePercentage: number;

  @Column({ type: 'float' })
  butyleneHeatCapacity: number;

  @Column({ type: 'float' })
  acetylenePercentage: number;

  @Column({ type: 'float' })
  acetyleneHeatCapacity: number;

  @Column({ type: 'float' })
  hydrogenSulfidePercentage: number;

  @Column({ type: 'float' })
  hydrogenSulfideHeatCapacity: number;

  @Column({ type: 'float' })
  carbonMonoxidePercentage: number;

  @Column({ type: 'float' })
  carbonMonoxideHeatCapacity: number;

  @Column({ type: 'float' })
  carbonDioxidePercentage: number;

  @Column({ type: 'float' })
  carbonDioxideHeatCapacity: number;

  @Column({ type: 'float' })
  nitrogenPercentage: number;

  @Column({ type: 'float' })
  nitrogenHeatCapacity: number;

  @Column({ type: 'float' })
  oxygenPercentage: number;

  @Column({ type: 'float' })
  oxygenHeatCapacity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
