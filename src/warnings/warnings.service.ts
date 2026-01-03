import { Injectable } from '@nestjs/common';
import { WarningDTO } from './dtos/warning.dto';
import { Warning } from './entities';

@Injectable()
export class WarningsService {
  private warnings: Warning[] = [];

  setWarnings(warnings: Warning[]): void {
    this.warnings = warnings;
  }

  addWarning(warning: Warning): void {
    this.warnings.push(warning);
  }

  clearWarnings(): void {
    this.warnings = [];
  }

  getWarnings(): WarningDTO[] {
    return this.warnings.map((warning) => new WarningDTO(warning));
  }
}
