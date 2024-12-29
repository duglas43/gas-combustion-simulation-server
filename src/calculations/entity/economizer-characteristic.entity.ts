import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class EconomizerCharacteristic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  outerCasingTubeDiameter: number;

  @Column({ type: 'float' })
  finThickness: number;

  @Column({ type: 'float' })
  finPitch: number;

  @Column({ type: 'float' })
  finSize: number;

  @Column({ type: 'float' })
  tubePitchInRow: number;

  @Column({ type: 'float' })
  rowPitch: number;

  @Column({ type: 'int' })
  tubesPerRow: number;

  @Column({ type: 'int' })
  numberOfRows: number;

  @Column({ type: 'float' })
  averageTubeLength: number;

  @Column({ type: 'float' })
  heatTransferSurfaceAreaPerTube: number;

  @Column({ type: 'float' })
  finHeight: number;

  @Column({ type: 'float' })
  relativeTubePitchInRow: number;

  @Column({ type: 'float' })
  relativeRowPitch: number;

  @Column({ type: 'int' })
  totalEconomizerTubes: number;

  @Column({ type: 'int' })
  numberOfColumns: number;

  @Column({ type: 'float' })
  totalHeatTransferSurfaceArea: number;

  @Column({ type: 'float' })
  channelCrossSectionArea: number;

  @Column({ type: 'float' })
  equivalentChannelDiameter: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
