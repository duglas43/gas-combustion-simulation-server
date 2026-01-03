import { ApiProperty } from '@nestjs/swagger';
import { WARNING_CODES } from '../enums';
import { Warning } from '../entities';

export class WarningDTO {
  @ApiProperty({ enum: Object.values(WARNING_CODES) })
  code: WARNING_CODES;

  @ApiProperty()
  message: string;

  @ApiProperty()
  timestamp: Date;

  constructor(model: WarningDTO | Warning) {
    this.code = model.code;
    this.message = model.message;
    this.timestamp = model.timestamp;
  }
}
