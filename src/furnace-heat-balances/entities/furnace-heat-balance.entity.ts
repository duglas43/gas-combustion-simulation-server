import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class FurnaceHeatBalance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  blackBodyRadiationCoefficient: number;

  @Column({ type: 'float' })
  screenPollutionCoefficient: number;

  @Column({ type: 'float' })
  parameterM0: number;

  @Column({ type: 'float' })
  luminousFlameFillingCoefficient: number;

  @Column({ type: 'float' })
  furnaceExitTemperatureSet: number;

  @Column({ type: 'float' })
  combustionProductEnthalpyExit: number;

  @Column({ type: 'float' })
  combustionAirEnthalpy: number;

  @Column({ type: 'float' })
  airFractionFromAirPreheater: number;

  @Column({ type: 'float' })
  heatInputToFurnaceFromAir: number;

  @Column({ type: 'float' })
  usefulHeatReleaseInFurnace: number;

  @Column({ type: 'float' })
  assumedAdiabaticCombustionTemperature: number;

  @Column({ type: 'float' })
  actualAdiabaticCombustionTemperature: number;

  @Column({ type: 'float' })
  imbalancePercentage: number;

  @Column({ type: 'float' })
  averageHeatCapacityProductsInFurnace: number;

  @Column({ type: 'float' })
  averageThermalEfficiencyCoefficient: number;

  @Column({ type: 'float' })
  boltzmannCriterion: number;

  @Column({ type: 'float' })
  maxTemperatureZoneHeight: number;

  @Column({ type: 'float' })
  relativeMaxTemperatureZonePosition: number;

  @Column({ type: 'float' })
  furnaceGasDilutionCoefficient: number;

  @Column({ type: 'float' })
  calculatedParameterM: number;

  @Column({ type: 'float' })
  rayAttenuationCoefficientThreeAtomGases: number;

  @Column({ type: 'float' })
  carbonToHydrogenMassRatio: number;

  @Column({ type: 'float' })
  sootRayAttenuationCoefficient: number;

  @Column({ type: 'float' })
  furnaceMediumAbsorptionCoefficient: number;

  @Column({ type: 'float' })
  bugerCriterion: number;

  @Column({ type: 'float' })
  effectiveBugerCriterion: number;

  @Column({ type: 'float' })
  combustionProductExitTemperature: number;

  @Column({ type: 'float' })
  calculatedImbalance: number;

  @Column({ type: 'float' })
  heatAbsorbedByRadiativeScreens: number;

  @Column({ type: 'float' })
  specificHeatLoadRadiativeScreens: number;

  @Column({ type: 'float' })
  specificHeatTensionFurnaceVolume: number;

  @Column({ type: 'float' })
  enthalpyIncrementHeatedHeatCarrier: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
