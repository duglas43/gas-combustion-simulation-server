import { Injectable } from '@nestjs/common';
import { CreateCalculationDto } from './dto/create-calculation.dto';

@Injectable()
export class CalculationsService {
  create(createCalculationDto: CreateCalculationDto) {
    return 'This action adds a new calculation';
  }
}
