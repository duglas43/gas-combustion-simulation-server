import { PartialType } from '@nestjs/swagger';
import { CreateLawsDto } from './create-laws.dto';

export class UpdateLawsDto extends PartialType(CreateLawsDto) {}
