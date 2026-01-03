import { ALERT_CODES } from '../enums';

export class Alert {
  code: ALERT_CODES;

  message: string;

  timestamp: Date;

  constructor(model: Alert) {
    this.code = model.code;
    this.message = model.message;
    this.timestamp = model.timestamp;
  }
}
