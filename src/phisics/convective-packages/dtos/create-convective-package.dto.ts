import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateConvectivePackageDto {
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

  @ApiProperty()
  @IsNumber()
  tubesPerRow: number;

  numberOfRows: number = 22;

  @ApiProperty()
  @IsNumber()
  minCrossSectionDimension: number;

  maxCrossSectionDimension: number = 2.6;

  averageTubeLength: number = 2.6;
}
