import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Gas Combustion Simulation API')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.use('/api/docs.json', (req, res) => {
    return res.send(document);
  });
  SwaggerModule.setup('api', app, document);
  await app.listen(configService.get('PORT'));
}
bootstrap();
