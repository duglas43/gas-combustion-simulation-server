import { ApiProperty } from '@nestjs/swagger';
import { Observation } from '../entities';

export class ObservationDto {
  @ApiProperty()
  time: Date;

  @ApiProperty()
  timestamp: number;

  @ApiProperty()
  load: number;

  @ApiProperty()
  efficiency: number;

  @ApiProperty()
  adiabaticCombustionTemperature: number;

  @ApiProperty()
  furnaceExitTemperature: number;

  @ApiProperty()
  firstConvectivePackageExitTemperature: number;

  @ApiProperty()
  secondConvectivePackageExitTemperature: number;

  @ApiProperty()
  economizerExitTemperature: number;

  @ApiProperty()
  flueGasTemperature: number;

  @ApiProperty()
  fuelConsumption: number;

  @ApiProperty()
  lossesWithFlueGasPercentage: number;

  @ApiProperty()
  lossesThroughWallsPercentage: number;

  @ApiProperty()
  totalLosses: number;

  @ApiProperty()
  furnaceImbalance: number;

  @ApiProperty()
  firstConvectivePackageImbalance: number;

  @ApiProperty()
  secondConvectivePackageImbalance: number;

  @ApiProperty()
  economizerImbalance: number;

  constructor(model: Observation | ObservationDto) {
    this.time = model.time;
    this.timestamp = model.timestamp;
    this.efficiency = model.efficiency;
    this.adiabaticCombustionTemperature = model.adiabaticCombustionTemperature;
    this.furnaceExitTemperature = model.furnaceExitTemperature;
    this.firstConvectivePackageExitTemperature =
      model.firstConvectivePackageExitTemperature;
    this.secondConvectivePackageExitTemperature =
      model.secondConvectivePackageExitTemperature;
    this.economizerExitTemperature = model.economizerExitTemperature;
    this.flueGasTemperature = model.flueGasTemperature;
    this.fuelConsumption = model.fuelConsumption;
    this.lossesWithFlueGasPercentage = model.lossesWithFlueGasPercentage;
    this.lossesThroughWallsPercentage = model.lossesThroughWallsPercentage;
    this.totalLosses = model.totalLosses;
    this.furnaceImbalance = model.furnaceImbalance;
    this.firstConvectivePackageImbalance =
      model.firstConvectivePackageImbalance;
    this.secondConvectivePackageImbalance =
      model.secondConvectivePackageImbalance;
    this.economizerImbalance = model.economizerImbalance;
  }
}
