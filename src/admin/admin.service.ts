import { Injectable, NotFoundException } from '@nestjs/common'; // Импортируем необходимые декораторы и исключения из NestJS
import { InjectRepository } from '@nestjs/typeorm'; // Импортируем декоратор для внедрения репозиториев из TypeORM
import { UserLoginDto } from 'src/auth/dto/user-login.dto'; // Импортируем DTO для логина пользователя
import { User } from 'src/users/entities/user.entity'; // Импортируем сущность User
import { Repository } from 'typeorm'; // Импортируем класс Repository из TypeORM для работы с сущностями
import { Admin } from './admin.entity'; // Импортируем сущность Admin
import { Video } from 'src/users/entities/video.entity'; // Импортируем сущность Video
import { CreateVideoDto } from './dto/create-video.dto'; // Импортируем DTO для создания видео
@Injectable() // Декоратор, который делает класс доступным для внедрения зависимостей
export class AdminService {
  constructor(
    @InjectRepository(User) // Внедряем репозиторий для работы с сущностью User
    private readonly userRepository: Repository<User>, // Объявляем переменную для репозитория User
    @InjectRepository(Admin) // Внедряем репозиторий для работы с сущностью Admin
    private readonly adminRepository: Repository<Admin>, // Объявляем переменную для репозитория Admin
    @InjectRepository(Video) // Внедряем репозиторий для работы с сущностью Video
    private readonly videoRepository: Repository<Video>, // Объявляем переменную для репозитория Video
  ) {}
  // Метод для поиска администратора по идентификатору
  async findById(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } }); // Ищем администратора по идентификатору
    if (!admin) {
      throw new NotFoundException('Администратор не найден'); // Если администратор не найден, выбрасываем исключение
    }
    return admin; // Возвращаем найденного администратора
  }
  // Метод для регистрации нового пользователя
  async registerUser(dto: UserLoginDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { login: dto.login }, // Ищем пользователя по логину
    });
    if (existingUser) {
      throw new NotFoundException('Пользователь уже существует'); // Если пользователь уже существует, выбрасываем исключение
    }
    const user = this.userRepository.create({
      login: dto.login, // Создаем нового пользователя с логином
      password: dto.password,
      personalData: dto.personalData// Сохраняем пароль в открытом виде (не рекомендуется для продакшн)
    });
    return this.userRepository.save(user); // Сохраняем пользователя в базе данных и возвращаем его
  }
  // Метод для добавления видео пользователю
  async addVideoToUser(
    userId: number, // Идентификатор пользователя
    createVideoDto: CreateVideoDto, // DTO для создания видео
  ): Promise<Video> {
    const user = await this.getUserById(userId); // Получаем пользователя по идентификатору
    const video = this.videoRepository.create({
      link: createVideoDto.link, // Создаем новое видео с указанной ссылкой
      user: user, // Связываем видео с пользователем
    });
    return this.videoRepository.save(video); // Сохраняем видео в базе данных и возвращаем его
  }
  // Метод для получения всех пользователей
  async getUsers(): Promise<User[]> {
    return this.userRepository.find({ relations: ['videos'] }); // Получаем пользователей с их видео
  }
  // Метод для удаления пользователя по идентификатору
  async deleteUserById(id: number): Promise<void> {
    const user = await this.getUserById(id); // Получаем пользователя по идентификатору
    await this.userRepository.remove(user); // Удаляем пользователя из базы данных
  }
  // Метод для удаления видео пользователя
  async deleteVideo(userId: number, videoId: number): Promise<void> {
    const user = await this.getUserById(userId); // Получаем пользователя по идентификатору
    const video = await this.videoRepository.findOne({
      where: { id: videoId, user }, // Ищем видео по идентификатору и связываем с пользователем
    });
    if (!video) {
      throw new NotFoundException('Видео не найдено'); // Если видео не найдено, выбрасываем исключение
    }
    await this.videoRepository.remove(video); // Удаляем видео из базы данных
  }
  // Приватный метод для получения пользователя по идентификатору
  private async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } }); // Ищем пользователя по идентификатору
    if (!user) {
      throw new NotFoundException('Пользователь не найден'); // Если пользователь не найден, выбрасываем исключение
    }
    return user; // Возвращаем найденного пользователя
  }
}
