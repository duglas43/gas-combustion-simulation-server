import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class TemperatureCharacteristic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  recirculationRate: number;

  @Column({ type: 'float' })
  combustionAirTemperature: number;

  @Column({ type: 'float' })
  gasMixtureHeatCapacity: number;

  @Column({ type: 'float' })
  boilerRoomAirHeatCapacity: number;

  @Column({ type: 'float' })
  combustionAirHeatCapacity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
