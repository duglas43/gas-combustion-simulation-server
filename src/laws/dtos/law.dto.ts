import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LAW_TYPES } from '../enums';

export class LawParamsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  value?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  target?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  rate?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  tau?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  amplitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  frequency?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  startTime?: number;
}

export class LawDto {
  @ApiProperty({ enum: Object.values(LAW_TYPES) })
  @IsEnum(LAW_TYPES)
  type: LAW_TYPES;

  @ApiProperty({ type: LawParamsDto })
  @ValidateNested()
  @Type(() => LawParamsDto)
  params: LawParamsDto;
}
