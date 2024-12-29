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

  @Column()
  recirculationRate: number;

  @Column()
  combustionAirTemperature: number;

  @Column()
  gasMixtureHeatCapacity: number;

  @Column()
  boilerRoomAirHeatCapacity: number;

  @Column()
  combustionAirHeatCapacity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
