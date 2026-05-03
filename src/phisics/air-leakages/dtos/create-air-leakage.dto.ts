import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateAirLeakageDto {
  @ApiProperty()
  @IsNumber()
  nominalFurnaceAirLeakage: number;

  @ApiProperty()
  @IsNumber()
  nominalFirstConvectiveAirLeakage: number;

  @ApiProperty()
  @IsNumber()
  nominalSecondConvectiveAirLeakage: number;

  @ApiProperty()
  @IsNumber()
  nominalEconomizerAirLeakage: number;
}
