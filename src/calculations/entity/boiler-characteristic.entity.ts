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

  @Column({ type: 'float' })
  nominalSteamProduction: number;

  @Column({ type: 'float' })
  actualSteamProduction: number;

  @Column({ type: 'float' })
  loadPercentage: number;

  @Column({ type: 'float' })
  blowdownPercentage: number;

  @Column({ type: 'float' })
  excessPressureInBoiler: number;

  @Column({ type: 'float' })
  airHumidityForCombustion: number;

  @Column({ type: 'float' })
  gasHumidityForCombustion: number;

  @Column({ type: 'float' })
  feedWaterTemperature: number;

  @Column({ type: 'float' })
  roomAirTemperature: number;

  @Column({ type: 'float' })
  gasInletTemperature: number;

  @Column({ type: 'float' })
  excessAirCoefficient: number;

  @Column({ type: 'float' })
  flueGasAbsolutePressure: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
