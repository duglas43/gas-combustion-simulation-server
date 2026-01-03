import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ObservationsService } from './observations.service';
import { FindObservationsDto } from './dtos/find-observations.dto';
import { ObservationsListDto } from './dtos/observations-list.dto';

@ApiTags('observations')
@Controller('observations')
export class ObservationsController {
  constructor(private readonly observationsService: ObservationsService) {}

  @Get()
  @ApiOkResponse({ type: ObservationsListDto })
  find(@Query() params: FindObservationsDto): Promise<ObservationsListDto> {
    return this.observationsService.find(params);
  }
}
