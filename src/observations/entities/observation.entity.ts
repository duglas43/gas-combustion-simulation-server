import { Entity, Column } from 'typeorm';
import { Hypertable, TimeColumn } from '@timescaledb/typeorm';

@Entity({ name: 'observations' })
@Hypertable({})
export class Observation {
  @TimeColumn()
  time: Date;

  @Column({ type: 'bigint', unique: true })
  timestamp: number;

  @Column({ type: 'float' })
  efficiency: number;

  @Column({ type: 'float' })
  adiabaticCombustionTemperature: number;

  @Column({ type: 'float' })
  furnaceExitTemperature: number;

  @Column({ type: 'float' })
  firstConvectivePackageExitTemperature: number;

  @Column({ type: 'float' })
  secondConvectivePackageExitTemperature: number;

  @Column({ type: 'float' })
  economizerExitTemperature: number;

  @Column({ type: 'float' })
  flueGasTemperature: number;

  @Column({ type: 'float' })
  fuelConsumption: number;

  @Column({ type: 'float' })
  lossesWithFlueGasPercentage: number;

  @Column({ type: 'float' })
  lossesThroughWallsPercentage: number;

  @Column({ type: 'float' })
  totalLosses: number;

  @Column({ type: 'float' })
  furnaceImbalance: number;

  @Column({ type: 'float' })
  firstConvectivePackageImbalance: number;

  @Column({ type: 'float' })
  secondConvectivePackageImbalance: number;

  @Column({ type: 'float' })
  economizerImbalance: number;
}
