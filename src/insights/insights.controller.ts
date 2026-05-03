import { Controller, Get } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { InsightsDto } from './dtos';
import { InsightsService } from './insights.service';

@ApiTags('insights')
@Controller('insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get()
  @ApiExtraModels(InsightsDto)
  @ApiOkResponse({
    schema: { $ref: getSchemaPath(InsightsDto) },
  })
  getCurrent(): InsightsDto {
    return this.insightsService.getCurrent();
  }
}
