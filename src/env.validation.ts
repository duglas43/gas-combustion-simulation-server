import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  Max,
  Min,
  validateSync,
  IsString,
  IsInt,
  IsBooleanString,
} from 'class-validator';
import { ENVIRONMENT } from 'src/common/enum';

class EnvironmentVariables {
  @IsEnum(ENVIRONMENT)
  NODE_ENV: ENVIRONMENT;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  DATABASE_HOST: string;

  @IsInt()
  DATABASE_PORT: number;

  @IsString()
  DATABASE_USERNAME: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_NAME: string;

  @IsBooleanString()
  DATABASE_SSL: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    forbidUnknownValues: true,
    forbidNonWhitelisted: true,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
