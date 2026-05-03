import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateResourceDto {
  @ApiProperty()
  @IsInt()
  public fuelRemaining: number;
}
