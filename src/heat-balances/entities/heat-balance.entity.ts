import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class HeatBalance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  heatLossDueToChemicalIncompleteCombustionPercentage: number;

  @Column({ type: 'float' })
  heatInputFromFuel: number;

  @Column({ type: 'float' })
  heatInputFromAir: number;

  @Column({ type: 'float' })
  availableHeatInputToBoiler: number;

  @Column({ type: 'float' })
  flueGasTemperature: number;

  @Column({ type: 'float' })
  flueGasEnthalpy: number;

  @Column({ type: 'float' })
  surroundingAirEnthalpy: number;

  @Column({ type: 'float' })
  heatLossWithFlueGases: number;

  @Column({ type: 'float' })
  heatLossWithFlueGasesPercentage: number;

  @Column({ type: 'float' })
  heatLossDueToChemicalIncompleteCombustion: number;

  @Column({ type: 'float' })
  heatLossThroughOuterWallsPercentage: number;

  @Column({ type: 'float' })
  heatLossThroughOuterWalls: number;

  @Column({ type: 'float' })
  boilerEfficiencyGross: number;

  @Column({ type: 'float' })
  totalHeatLoss: number;

  @Column({ type: 'float' })
  blowdownWaterFlow: number;

  @Column({ type: 'float' })
  usefulHeatUtilized: number;

  @Column({ type: 'float' })
  calculatedHourlyFuelConsumption: number;

  @Column({ type: 'float' })
  heatedHeatCarrierFlow: number;

  @Column({ type: 'float' })
  heatRetentionCoefficient: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
