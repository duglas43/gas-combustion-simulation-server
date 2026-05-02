import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { StateService } from './state.service';
import { StateDto } from './dtos';

@ApiTags('state')
@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Get()
  @ApiOkResponse({ type: StateDto })
  getCurrentState() {
    return this.stateService.getCurrentDto();
  }
}
