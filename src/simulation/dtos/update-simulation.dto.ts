import { UpdateStateDto } from 'src/state/dtos';
import { UpdateRuntimeDto } from 'src/runtime/dtos';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { LawDto } from 'src/laws/dtos';

export class UpdateSimulationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateStateDto)
  state?: UpdateStateDto;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: { type: 'object' },
  })
  @IsOptional()
  @IsObject()
  laws?: Record<string, LawDto>;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateRuntimeDto)
  runtime?: UpdateRuntimeDto;
}
