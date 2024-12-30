import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class AirExcessCoefficient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'float' })
  value: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// @Column({ type: 'float' })
// alpha: number;

// @Column({ type: 'float' })
// alphaBurner: number;

// @Column({ type: 'float' })
// alphaFurnaceAvg: number;

// @Column({ type: 'float' })
// alphaFurnace: number;

// @Column({ type: 'float' })
// alphaConvectivePackage1Avg: number;

// @Column({ type: 'float' })
// alphaConvectivePackage1: number;

// @Column({ type: 'float' })
// alphaConvectivePackage2Avg: number;

// @Column({ type: 'float' })
// alphaConvectivePackage2: number;

// @Column({ type: 'float' })
// alphaEconomizerAvg: number;

// @Column({ type: 'float' })
// alphaFlueGas: number;
