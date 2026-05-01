import { Body, Controller, Post } from '@nestjs/common';
import { CalculationsService } from './calculations.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ObservationDto } from 'src/observations/dtos';
import { CreateStateDto } from 'src/state/dtos';

@ApiTags('calculations')
@Controller('calculations')
export class CalculationsController {
  constructor(private readonly calculationsService: CalculationsService) {}

  @Post()
  @ApiCreatedResponse({ type: ObservationDto })
  getCalculations(@Body() createStateDto: CreateStateDto): ObservationDto {
    return this.calculationsService.getCalculations(createStateDto);
  }
}
