import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class FurnaceCharacteristic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  firstScreenArea: number;

  @Column({ type: 'float' })
  firstScreenAngleCoefficient: number;

  @Column({ type: 'float' })
  secondScreenArea: number;

  @Column({ type: 'float' })
  secondScreenAngleCoefficient: number;

  @Column({ type: 'float' })
  thirdScreenArea: number;

  @Column({ type: 'float' })
  thirdScreenAngleCoefficient: number;

  @Column({ type: 'float' })
  fourthScreenArea: number;

  @Column({ type: 'float' })
  fourthScreenAngleCoefficient: number;

  @Column({ type: 'float' })
  fifthScreenArea: number;

  @Column({ type: 'float' })
  fifthScreenAngleCoefficient: number;

  @Column({ type: 'float' })
  nonScreenedFurnaceArea: number;

  @Column({ type: 'float' })
  furnaceVolume: number;

  @Column({ type: 'float' })
  furnaceHeight: number;

  @Column({ type: 'float' })
  firstBurnerRowHeight: number;

  @Column({ type: 'int' })
  burnersInFirstRow: number;

  @Column({ type: 'float' })
  secondBurnerRowHeight: number;

  @Column({ type: 'int' })
  burnersInSecondRow: number;

  @Column({ type: 'float' })
  firstScreenRadiantHeatSurface: number;

  @Column({ type: 'float' })
  secondScreenRadiantHeatSurface: number;

  @Column({ type: 'float' })
  thirdScreenRadiantHeatSurface: number;

  @Column({ type: 'float' })
  fourthScreenRadiantHeatSurface: number;

  @Column({ type: 'float' })
  fifthScreenRadiantHeatSurface: number;

  @Column({ type: 'float' })
  totalRadiantHeatSurfaceArea: number;

  @Column({ type: 'float' })
  totalWallSurfaceArea: number;

  @Column({ type: 'float' })
  furnaceScreeningDegree: number;

  @Column({ type: 'float' })
  effectiveRadiatingLayerThickness: number;

  @Column({ type: 'int' })
  totalBurnersInBoiler: number;

  @Column({ type: 'float' })
  screenContaminationFactor: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
