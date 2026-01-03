import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateRuntimeDto {
  @ApiPropertyOptional()
  @IsInt()
  speedUpFactor: number = 1;
}
