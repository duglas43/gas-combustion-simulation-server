import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ConvectivePackage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  packageNumber: number;

  @Column({ type: 'float' })
  outerTubeDiameter: number;

  @Column({ type: 'float' })
  innerTubeDiameter: number;

  @Column({ type: 'float' })
  tubePitchInRow: number;

  @Column({ type: 'float' })
  rowPitch: number;

  @Column({ type: 'int' })
  tubesPerRow: number;

  @Column({ type: 'int' })
  numberOfRows: number;

  @Column({ type: 'float' })
  minCrossSectionDimension: number;

  @Column({ type: 'float' })
  maxCrossSectionDimension: number;

  @Column({ type: 'float' })
  averageTubeLength: number;

  @Column({ type: 'float' })
  relativeTubePitchInRow: number;

  @Column({ type: 'float' })
  relativeRowPitch: number;

  @Column({ type: 'float' })
  effectiveRadiatingLayerThickness: number;

  @Column({ type: 'float' })
  convectivePackageHeatSurfaceArea: number;

  @Column({ type: 'int' })
  totalNumberOfTubes: number;

  @Column({ type: 'float' })
  channelCrossSectionArea: number;

  @Column({ type: 'float' })
  equivalentChannelDiameter: number;

  @Column({ type: 'float' })
  wallBlacknessDegree: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
