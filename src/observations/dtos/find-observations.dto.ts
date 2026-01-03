import { ApiProperty } from '@nestjs/swagger';

export class FindObservationsDto {
  @ApiProperty()
  from: number;

  @ApiProperty()
  to: number;
}
