import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { ConvectivePackage } from './convective-package.entity';

@Entity()
export class ConvectivePackageHeatBalance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  convectivePackageId: number;

  @OneToOne(() => ConvectivePackage)
  convectivePackage: ConvectivePackage;

  @Column({ type: 'float' })
  averageHeatAbsorptionCoefficient: number;

  @Column({ type: 'float' })
  sumAngularCoefficients: number;

  @Column({ type: 'float' })
  furnaceExitWindowArea: number;

  @Column({ type: 'float' })
  geometricAdjustmentFactor: number;

  @Column({ type: 'float' })
  screenWallBlacknessDegree: number;

  @Column({ type: 'float' })
  heatEfficiencyCoefficient: number;

  @Column({ type: 'float' })
  heatUtilizationCoefficient: number;

  @Column({ type: 'float' })
  packageExitTemperature: number;

  @Column({ type: 'float' })
  combustionProductEnthalpyExit: number;

  @Column({ type: 'float' })
  heatBalanceAbsorption: number;

  @Column({ type: 'float' })
  radiativeHeatLoad: number;

  @Column({ type: 'float' })
  heatReceivedByRadiation: number;

  @Column({ type: 'float' })
  enthalpyIncrease: number;

  @Column({ type: 'float' })
  heatedMediumTemperature: number;

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
  correctionCoefficientCs: number;

  @Column({ type: 'float' })
  correctionCoefficientCz: number;

  @Column({ type: 'float' })
  convectiveHeatTransferCoefficient: number;

  @Column({ type: 'float' })
  threeAtomGasRayAttenuationCoefficient: number;

  @Column({ type: 'float' })
  radiativeLayerOpticalThickness: number;

  @Column({ type: 'float' })
  effectiveBlacknessDegree: number;

  @Column({ type: 'float' })
  averageWallTemperature: number;

  @Column({ type: 'float' })
  radiativeHeatTransferCoefficient: number;

  @Column({ type: 'float' })
  heatTransferCoefficient: number;

  @Column({ type: 'float' })
  heatTransferByEquation: number;

  @Column({ type: 'float' })
  exitTemperatureControlValue: number;

  @Column({ type: 'float' })
  heatBalanceImbalance: number;

  @Column({ type: 'float' })
  specificHeatTransferred: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
