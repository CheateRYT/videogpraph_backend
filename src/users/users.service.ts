import { Injectable, NotFoundException } from '@nestjs/common'; // Импортируем необходимые декораторы и исключения из NestJS
import { InjectRepository } from '@nestjs/typeorm'; // Импортируем декоратор для внедрения репозиториев из TypeORM
import { Repository } from 'typeorm'; // Импортируем класс Repository из TypeORM для работы с сущностями
import { User } from './entities/user.entity'; // Импортируем сущность User
import { Video } from './entities/video.entity'; // Импортируем сущность Video
@Injectable() // Декоратор, который делает класс доступным для внедрения зависимостей
export class UsersService {
  constructor(
    @InjectRepository(User) // Внедряем репозиторий для работы с сущностью User
    private readonly userRepository: Repository<User>, // Объявляем переменную для репозитория User
    @InjectRepository(Video) // Внедряем репозиторий для работы с сущностью Video
    private readonly videoRepository: Repository<Video>, // Объявляем переменную для репозитория Video
  ) {}
  // Метод для получения видео пользователя по его идентификатору
  async getUserVideos(userId: number): Promise<Video[]> {
    // Ищем пользователя по его идентификатору, включая связанные видео
    const user = await this.userRepository.findOne({
      where: { id: userId }, // Условие поиска по идентификатору
      relations: ['videos'], // Включаем связанные видео
    });

    // Если пользователь не найден, выбрасываем исключение
    if (!user) {
      throw new NotFoundException('Пользователь не найден'); // Исключение, если пользователь не найден
    }

    return user.videos; // Возвращаем все видео пользователя
  }
  // Метод для получения профиля пользователя по его идентификатору
  async getUserProfile(userId: number): Promise<User> {
    // Ищем пользователя по его идентификатору, включая связанные видео
    const user = await this.userRepository.findOne({
      where: { id: userId }, // Условие поиска по идентификатору
      relations: ['videos'], // Включаем связанные видео
    });

    // Если пользователь не найден, выбрасываем исключение
    if (!user) {
      throw new NotFoundException('Пользователь не найден'); // Исключение, если пользователь не найден
    }
    return user; // Возвращаем найденного пользователя
  }
}
