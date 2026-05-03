import { ApiProperty } from '@nestjs/swagger';
import { StateDto } from 'src/state/dtos';
import { Laws } from 'src/laws/entities';
import { StateSnapshot } from '../entities';

export class StateSnapshotDto {
  @ApiProperty()
  time: Date;

  @ApiProperty()
  timestamp: number;

  @ApiProperty()
  state: StateDto;

  @ApiProperty()
  laws?: Laws;

  constructor(model: StateSnapshot | StateSnapshotDto) {
    this.time = model.time;
    this.timestamp = Number(model.timestamp);
    this.state = new StateDto(model.state);
    this.laws = model.laws;
  }
}
