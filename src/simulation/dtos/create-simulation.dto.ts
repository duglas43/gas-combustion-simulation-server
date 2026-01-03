import { CreateStateDto } from 'src/state/dtos';
import { CreateRuntimeDto } from 'src/runtime/dtos';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSimulationDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateStateDto)
  state: CreateStateDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateRuntimeDto)
  runtime: CreateRuntimeDto;
}
