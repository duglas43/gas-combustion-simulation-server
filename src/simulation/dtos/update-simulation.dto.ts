import { UpdateStateDto } from 'src/state/dtos';
import { UpdateRuntimeDto } from 'src/runtime/dtos';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSimulationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateStateDto)
  state?: UpdateStateDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateRuntimeDto)
  runtime?: UpdateRuntimeDto;
}
