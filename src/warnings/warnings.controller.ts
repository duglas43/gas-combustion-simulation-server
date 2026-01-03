import { Controller, Get } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { WarningsService } from './warnings.service';
import { WarningDTO } from './dtos/warning.dto';

@ApiTags('warnings')
@Controller('warnings')
export class WarningsController {
  constructor(private readonly warningsService: WarningsService) {}

  @Get()
  @ApiExtraModels(WarningDTO)
  @ApiOkResponse({
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(WarningDTO) },
    },
  })
  getWarnings(): WarningDTO[] {
    return this.warningsService.getWarnings();
  }
}
