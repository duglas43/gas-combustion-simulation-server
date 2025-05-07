import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Allow, IsNumber, Max, ValidateNested } from 'class-validator';

class CreateFurnaceCharacteristicCalculationDto {
  firstScreenArea: number = 5.94;
  firstScreenAngleCoefficient: number = 0.88;
  secondScreenArea: number = 26.4;
  secondScreenAngleCoefficient: number = 0.94;
  thirdScreenArea: number = 22.9;
  thirdScreenAngleCoefficient: number = 0.9;
  fourthScreenArea: number = 11.3;
  fourthScreenAngleCoefficient: number = 0.88;
  fifthScreenArea: number = 0;
  fifthScreenAngleCoefficient: number = 0;
  nonScreenedFurnaceArea: number = 14;
  furnaceVolume: number = 40.5;
  furnaceHeight: number = 4.4;
  firstBurnerRowHeight: number = 1;
  burnersInFirstRow: number = 2;
  secondBurnerRowHeight: number = 0;
  burnersInSecondRow: number = 0;
  firstScreenRadiantHeatSurface: number = 5.23;
  secondScreenRadiantHeatSurface: number = 24.82;
  thirdScreenRadiantHeatSurface: number = 20.61;
  fourthScreenRadiantHeatSurface: number = 9.94;
  fifthScreenRadiantHeatSurface: number = 0;
  totalRadiantHeatSurfaceArea: number = 60.6;
  totalWallSurfaceArea: number = 80.54;
  furnaceScreeningDegree: number = 0.752;
  effectiveRadiatingLayerThickness: number = 1.81;
  totalBurnersInBoiler: number = 2;

  @ApiProperty()
  @IsNumber()
  screenContaminationFactor: number;
}

class CreateExternalConditionsCalculationDto {
  @ApiProperty()
  @IsNumber()
  boilerLoadPercentage: number;

  @ApiProperty()
  @IsNumber()
  airHumidityForCombustion: number;

  @ApiProperty()
  @IsNumber()
  gasHumidityForCombustion: number;

  @ApiProperty()
  @IsNumber()
  feedWaterTemperature: number;

  @ApiProperty()
  @IsNumber()
  boilerRoomAirTemperature: number;

  @ApiProperty()
  @IsNumber()
  gasInletTemperature: number;

  @ApiProperty()
  @IsNumber()
  flueGasPressure: number;
}

export class CreateBoilerCharacteristicsCalculationDto {
  nominalSteamProduction: number = 10;
  loadPercentage: number;
  blowdownPercentage: number = 2.1;
  excessPressureInBoiler: number = 1.3;
  airHumidityForCombustion: number;
  gasHumidityForCombustion: number;
  feedWaterTemperature: number;
  roomAirTemperature: number;
  gasInletTemperature: number;
  excessAirCoefficient: number = 1.1;
  flueGasAbsolutePressure: number = 0.1;

  constructor(externalConditions?: CreateExternalConditionsCalculationDto) {
    if (!externalConditions) return;
    this.loadPercentage = externalConditions.boilerLoadPercentage;
    this.airHumidityForCombustion = externalConditions.airHumidityForCombustion;
    this.gasHumidityForCombustion = externalConditions.gasHumidityForCombustion;
    this.feedWaterTemperature = externalConditions.feedWaterTemperature;
    this.roomAirTemperature = externalConditions.boilerRoomAirTemperature;
    this.gasInletTemperature = externalConditions.gasInletTemperature;
  }
}

class CreateFuelCompositionCalculationDto {
  @ApiProperty()
  @IsNumber()
  @Max(100)
  methanePercentage: number;

  @ApiProperty()
  @IsNumber()
  @Max(100)
  ethanePercentage: number;

  @ApiProperty()
  @IsNumber()
  @Max(100)
  propanePercentage: number;

  @ApiProperty()
  @IsNumber()
  @Max(100)
  nButanePercentage: number;

  @ApiProperty()
  @IsNumber()
  @Max(100)
  isoButanePercentage: number;

  @ApiProperty()
  @IsNumber()
  @Max(100)
  pentanePercentage: number;

  @ApiProperty()
  @IsNumber()
  @Max(100)
  hydrogenPercentage: number;

  @ApiProperty()
  @IsNumber()
  @Max(100)
  ethylenePercentage: number;

  @ApiProperty()
  @IsNumber()
  @Max(100)
  propylenePercentage: number;

  @ApiProperty()
  @IsNumber()
  @Max(100)
  butylenePercentage: number;

  @ApiProperty()
  @IsNumber()
  @Max(100)
  acetylenePercentage: number;

  @ApiProperty()
  @IsNumber()
  @Max(100)
  hydrogenSulfidePercentage: number;

  @ApiProperty()
  @IsNumber()
  @Max(100)
  carbonMonoxidePercentage: number;

  @ApiProperty()
  @IsNumber()
  @Max(100)
  carbonDioxidePercentage: number;

  @ApiProperty()
  @IsNumber()
  @Max(100)
  nitrogenPercentage: number;

  @ApiProperty()
  @IsNumber()
  @Max(100)
  oxygenPercentage: number;
}

export class ConvectivePackageParameters {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  wallBlacknessDegree: number;

  outerTubeDiameter: number = 51;

  innerTubeDiameter: number = 46;

  tubePitchInRow: number = 100;

  rowPitch: number = 110;

  tubesPerRow: number = 16;

  numberOfRows: number = 22;

  minCrossSectionDimension: number = 1.64;

  maxCrossSectionDimension: number = 2.6;

  averageTubeLength: number = 2.6;
}

export class CreateCalculationDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateFuelCompositionCalculationDto)
  fuelComposition: CreateFuelCompositionCalculationDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateExternalConditionsCalculationDto)
  externalConditions: CreateExternalConditionsCalculationDto;

  @Allow()
  @Type(() => CreateBoilerCharacteristicsCalculationDto)
  boilerCharacteristics: CreateBoilerCharacteristicsCalculationDto =
    new CreateBoilerCharacteristicsCalculationDto();

  @ApiProperty({ type: CreateFurnaceCharacteristicCalculationDto })
  @ValidateNested()
  @Type(() => CreateFurnaceCharacteristicCalculationDto)
  furnaceCharacteristics: CreateFurnaceCharacteristicCalculationDto;

  @ApiProperty({ type: [ConvectivePackageParameters] })
  @ValidateNested({ each: true })
  @Type(() => ConvectivePackageParameters)
  convectivePackagesParameters: ConvectivePackageParameters[];
}
