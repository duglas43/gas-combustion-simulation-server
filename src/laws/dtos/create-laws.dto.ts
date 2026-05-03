import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional } from 'class-validator';
import { LawDto } from './law.dto';

export class CreateLawsDto {
  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: { type: 'object' },
  })
  @IsOptional()
  @IsObject()
  laws?: Record<string, LawDto>;
}
