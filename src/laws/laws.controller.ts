import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LawsService } from './laws.service';

@ApiTags('laws')
@Controller('laws')
export class LawsController {
  constructor(private readonly lawsService: LawsService) {}

  @Get()
  @ApiOkResponse({ type: Object })
  getCurrent() {
    return this.lawsService.getCurrent();
  }
}
