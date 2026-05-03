import { Controller, Get } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AlertsService } from './alerts.service';
import { AlertDTO } from './dtos';

@ApiTags('alerts')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  @ApiExtraModels(AlertDTO)
  @ApiOkResponse({
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(AlertDTO) },
    },
  })
  getAlerts(): AlertDTO[] {
    return this.alertsService.getAlerts();
  }
}
