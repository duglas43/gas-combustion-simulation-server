import { CreateStateDto } from 'src/state/dtos';
import { CreateRuntimeDto } from 'src/runtime/dtos';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LawDto } from 'src/laws/dtos';

export class CreateSimulationDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateStateDto)
  state: CreateStateDto;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: { type: 'object' },
  })
  @IsOptional()
  @IsObject()
  laws?: Record<string, LawDto>;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateRuntimeDto)
  runtime: CreateRuntimeDto;
}
