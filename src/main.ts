import { NestFactory } from '@nestjs/core'; // Импортируем NestFactory для создания экземпляра приложения Nest
import { AppModule } from './app.module'; // Импортируем основной модуль приложения AppModule
import { ConfigService } from '@nestjs/config'; // Импортируем сервис конфигурации для доступа к переменным окружения
// Асинхронная функция для инициализации и запуска приложения
import * as express from 'express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Создаем экземпляр приложения Nest на основе AppModule
  app.setGlobalPrefix('api'); // Устанавливаем префикс 'api' для всех маршрутов приложения
  const configService: ConfigService = app.get(ConfigService); // Получаем экземпляр ConfigService для доступа к переменным окружения
  app.enableCors(); // Включаем CORS (Cross-Origin Resource Sharing) для приложения
  app.use(express.static(join(__dirname, '../public')));// Указываем путь к статическим файлам
  await app.listen(configService.get<number>('PORT') || 3000); // Запускаем сервер на порту, указанном в переменных окружения, или 3000 по умолчанию
}
// Запуск приложения
bootstrap(); // Вызываем функцию bootstrap для инициализации и запуска приложения
