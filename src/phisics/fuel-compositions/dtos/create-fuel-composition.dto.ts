import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

/**
 * DTO for creating a fuel composition.
 */
export class CreateFuelCompositionDto {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  methanePercentage: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
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
  @Min(0)
  @Max(100)
  isoButanePercentage: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  pentanePercentage: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
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
  @Min(0)
  @Max(100)
  butylenePercentage: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  acetylenePercentage: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  hydrogenSulfidePercentage: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  carbonMonoxidePercentage: number;

  @ApiProperty()
  @Min(0)
  @Min(0)
  @Max(100)
  carbonDioxidePercentage: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  nitrogenPercentage: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  oxygenPercentage: number;
}
