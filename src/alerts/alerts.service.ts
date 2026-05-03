import { Injectable } from '@nestjs/common';
import { AlertDTO } from './dtos';
import { Alert } from './entities';

@Injectable()
export class AlertsService {
  private alerts: Alert[] = [];

  setAlerts(alerts: Alert[]): void {
    this.alerts = alerts;
  }

  addAlert(alert: Alert): void {
    this.alerts.push(alert);
  }

  clearAlerts(): void {
    this.alerts = [];
  }

  getAlerts(): AlertDTO[] {
    return this.alerts.map((alert) => new AlertDTO(alert));
  }
}
