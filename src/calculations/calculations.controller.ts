import { Controller, Post, Body } from '@nestjs/common';
import { CalculationsService } from './calculations.service';
import { CreateCalculationDto } from './dto/create-calculation.dto';
import { ApiTags } from '@nestjs/swagger';
import { FillDefaultValuesPipe } from './fill-default-values/fill-default-values.pipe';

@Controller('calculations')
@ApiTags('calculations')
export class CalculationsController {
  constructor(private readonly calculationsService: CalculationsService) {}

  @Post()
  create(
    @Body(new FillDefaultValuesPipe())
    createCalculationDto: CreateCalculationDto,
  ) {
    return this.calculationsService.create(createCalculationDto);
  }
}
