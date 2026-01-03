import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RuntimeService } from './runtime.service';
import { RuntimeDto } from './dtos';

@ApiTags('runtime')
@Controller('runtime')
export class RuntimeController {
  constructor(private readonly runtimeService: RuntimeService) {}

  @Get()
  @ApiOkResponse({ type: RuntimeDto })
  getCurrentRuntime() {
    return this.runtimeService.getCurrentDto();
  }
}
