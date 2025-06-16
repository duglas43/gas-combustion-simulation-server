import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalculationsModule } from './calculations/calculations.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validation';
import { APP_PIPE } from '@nestjs/core';
import { EconomizerCharacteristicsModule } from './economizer-characteristics/economizer-characteristics.module';
import { BoilerCharacteristicsModule } from './boiler-characteristics/boiler-characteristics.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: ['.env.development.local', '.env.development', '.env'],
    }),
    CalculationsModule,
    EconomizerCharacteristicsModule,
    BoilerCharacteristicsModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
        }),
    },
  ],
})
export class AppModule {}
