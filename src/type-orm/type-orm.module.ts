import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule as TypeOrmLibModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    TypeOrmLibModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          ssl: configService.get('DB_SSL') && {
            rejectUnauthorized: false,
          },
          autoLoadEntities: true,
          synchronize: configService.get('DB_SYNCHRONIZE'),
          namingStrategy: new SnakeNamingStrategy(),
          logging: false,
          charset: 'utf8mb4',
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmLibModule],
})
export class TypeOrmModule {}
