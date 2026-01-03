import { ApiProperty } from '@nestjs/swagger';
import { RUNTIME_STATUSES } from '../enums';
import { Runtime } from '../entities';

export class RuntimeDto {
  @ApiProperty({ enum: Object.values(RUNTIME_STATUSES) })
  status: RUNTIME_STATUSES;

  @ApiProperty()
  currentTime: number;

  @ApiProperty()
  speedUpFactor: number;

  public constructor(partial: RuntimeDto | Runtime) {
    this.status = partial.status;
    this.currentTime = partial.currentTime;
    this.speedUpFactor = partial.speedUpFactor;
  }
}
