import { Injectable, PipeTransform } from '@nestjs/common';
import {
  CreateBoilerCharacteristicsCalculationDto,
  CreateCalculationDto,
} from '../dto/create-calculation.dto';

@Injectable()
export class FillDefaultValuesPipe implements PipeTransform {
  transform(value: CreateCalculationDto) {
    const updatedValue = {
      ...value,
      boilerCharacteristics: new CreateBoilerCharacteristicsCalculationDto(
        value.externalConditions,
      ),
    };
    delete updatedValue.externalConditions;
    return updatedValue;
  }
}
