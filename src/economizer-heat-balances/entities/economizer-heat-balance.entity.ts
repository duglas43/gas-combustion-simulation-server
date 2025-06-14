import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class EconomizerHeatBalance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  geometricAdjustmentFactor: number;

  @Column({ type: 'float' })
  heatEfficiencyCoefficient: number;

  @Column({ type: 'float' })
  heatUtilizationCoefficient: number;

  @Column({ type: 'float' })
  economizerExitTemperature: number;

  @Column({ type: 'float' })
  combustionProductEnthalpyExit: number;

  @Column({ type: 'float' })
  economizerHeatAbsorption: number;

  @Column({ type: 'float' })
  maxHeatedMediumTemperature: number;

  @Column({ type: 'float' })
  averageHeatedMediumTemperature: number;

  @Column({ type: 'float' })
  enthalpyIncrease: number;

  @Column({ type: 'float' })
  heatedMediumExitTemperature: number;

  @Column({ type: 'float' })
  averageHeatedMediumExitTemperature: number;

  @Column({ type: 'float' })
  logarithmicTemperatureDifference: number;

  @Column({ type: 'float' })
  averageCombustionTemperature: number;

  @Column({ type: 'float' })
  averageCombustionVelocity: number;

  @Column({ type: 'float' })
  reynoldsCriterion: number;

  @Column({ type: 'float' })
  prandtlCriterion: number;

  @Column({ type: 'float' })
  finningCoefficient: number;

  @Column({ type: 'float' })
  parameterPhi: number;

  @Column({ type: 'float' })
  correctionCoefficientCs: number;

  @Column({ type: 'float' })
  correctionCoefficientCz: number;

  @Column({ type: 'float' })
  convectiveHeatTransferCoefficient: number;

  @Column({ type: 'float' })
  heatTransferCoefficient: number;

  @Column({ type: 'float' })
  heatTransferByEquation: number;

  @Column({ type: 'float' })
  controlExitTemperature: number;

  @Column({ type: 'float' })
  heatBalanceImbalance: number;

  @Column({ type: 'float' })
  specificHeatTransferEconomizer: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
