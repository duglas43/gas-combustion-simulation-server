import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          level: 'info',
          autoLogging: false,
          quietReqLogger: true,
          transport: {
            targets: [
              {
                target: 'pino-pretty',
              },
              {
                target: 'pino-elasticsearch',
                options: {
                  index: 'gas-combustion-simulation-logs',
                  node: configService.get('ELASTIC_URL'),
                  esVersion: configService.get('ELASTIC_VERSION'),
                  auth: {
                    username: configService.get('ELASTIC_USERNAME'),
                    password: configService.get('ELASTIC_PASSWORD'),
                  },
                  tls: {
                    rejectUnauthorized: false,
                  },
                  flushBytes: 1000,
                },
              },
            ],
          },
        },
      }),
    }),
  ],
})
export class LoggerModule {}
