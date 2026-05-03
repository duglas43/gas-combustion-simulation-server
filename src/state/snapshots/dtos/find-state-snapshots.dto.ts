import { ApiProperty } from '@nestjs/swagger';

export class FindStateSnapshotsDto {
  @ApiProperty()
  from: number;

  @ApiProperty()
  to: number;
}
