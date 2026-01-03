import { PartialType } from '@nestjs/swagger';
import { CreateRuntimeDto } from './create-runtime.dto';

export class UpdateRuntimeDto extends PartialType(CreateRuntimeDto) {}
