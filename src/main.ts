import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const configService: ConfigService = app.get(ConfigService);

  await app.listen(configService.get<number>('PORT') || 3000);
}

// Запуск приложения
bootstrap();
