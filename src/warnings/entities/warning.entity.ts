import { WARNING_CODES } from '../enums';

export class Warning {
  code: WARNING_CODES;

  message: string;

  timestamp: Date;

  constructor(model: Warning) {
    this.code = model.code;
    this.message = model.message;
    this.timestamp = model.timestamp;
  }
}
