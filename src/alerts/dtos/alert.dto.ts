import { ApiProperty } from '@nestjs/swagger';
import { ALERT_CODES } from '../enums';
import { Alert } from '../entities';

export class AlertDTO {
  @ApiProperty({ enum: Object.values(ALERT_CODES) })
  code: ALERT_CODES;

  @ApiProperty()
  message: string;

  @ApiProperty()
  timestamp: Date;

  constructor(model: AlertDTO | Alert) {
    this.code = model.code;
    this.message = model.message;
    this.timestamp = model.timestamp;
  }
}
