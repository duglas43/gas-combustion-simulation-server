import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BoilerCharacteristic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nominalSteamProduction: number;

  @Column()
  actualSteamProduction: number;

  @Column()
  loadPercentage: number;

  @Column()
  blowdownPercentage: number;

  @Column()
  excessPressureInBoiler: number;

  @Column()
  airHumidityForCombustion: number;

  @Column()
  gasHumidityForCombustion: number;

  @Column()
  feedWaterTemperature: number;

  @Column()
  roomAirTemperature: number;

  @Column()
  gasInletTemperature: number;

  @Column()
  excessAirCoefficient: number;

  @Column()
  flueGasAbsolutePressure: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
