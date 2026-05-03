import { ApiProperty } from '@nestjs/swagger';
import { StateSnapshotDto } from './state-snapshot.dto';

export class StateSnapshotsListDto {
  @ApiProperty({ type: [StateSnapshotDto] })
  historical: StateSnapshotDto[];

  @ApiProperty({ type: StateSnapshotDto })
  current: StateSnapshotDto;

  @ApiProperty({ type: [StateSnapshotDto] })
  forecast: StateSnapshotDto[];

  constructor(partial: Partial<StateSnapshotsListDto>) {
    this.historical = partial.historical;
    this.current = partial.current;
    this.forecast = partial.forecast;
  }
}
