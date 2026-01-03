import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StateService } from './state.service';

@ApiTags('state')
@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Get()
  getCurrentState() {
    return this.stateService.getCurrent();
  }
}
