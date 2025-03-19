import { UserLoginDto } from './dto/user-login.dto'; // Импортируем DTO для логина пользователя
import {
  Injectable, // Импортируем декоратор Injectable для определения сервиса
  NotFoundException, // Импортируем исключение для обработки случаев, когда объект не найден
  UnauthorizedException, // Импортируем исключение для обработки случаев, когда доступ несанкционирован
} from '@nestjs/common'; // Импортируем необходимые модули из NestJS
import { InjectRepository } from '@nestjs/typeorm'; // Импортируем декоратор для внедрения репозиториев из TypeORM
import { Repository } from 'typeorm'; // Импортируем класс Repository из TypeORM для работы с сущностями
import { ConfigService } from '@nestjs/config'; // Импортируем сервис конфигурации для доступа к переменным окружения
import * as jwt from 'jsonwebtoken'; // Импортируем библиотеку для работы с JSON Web Token (JWT)
import * as argon2 from 'argon2'; // Импортируем argon2 для хеширования паролей
import { Admin } from 'src/admin/admin.entity'; // Импортируем сущность Admin
import { User } from 'src/users/entities/user.entity'; // Импортируем сущность User
@Injectable() // Декоратор, который делает класс доступным для внедрения зависимостей
export class AuthService {
  constructor(
    @InjectRepository(Admin) // Внедряем репозиторий для работы с сущностью Admin
    private readonly adminRepository: Repository<Admin>, // Объявляем переменную для репозитория Admin
    @InjectRepository(User) // Внедряем репозиторий для работы с сущностью User
    private readonly userRepository: Repository<User>, // Объявляем переменную для репозитория User
    private readonly configService: ConfigService, // Внедряем сервис конфигурации для доступа к переменным окружения
  ) {}
  // Метод для логина администратора
  async loginAdmin(dto: UserLoginDto): Promise<{ accessToken: string }> {
    const { login, password } = dto; // Извлекаем логин и пароль из DTO
    const admin = await this.adminRepository.findOne({ where: { login } }); // Ищем администратора по логину
    if (!admin) {
      throw new NotFoundException('Администратор не найден'); // Если администратор не найден, выбрасываем исключение
    }
    const isPasswordValid = await argon2.verify(admin.password, password); // Проверяем, соответствует ли введенный пароль хешированному паролю администратора
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный пароль'); // Если пароль неверный, выбрасываем исключение
    }
    const accessToken = this.generateAccessToken(admin); // Генерируем токен доступа для администратора
    admin.accessToken = accessToken; // Сохраняем токен доступа в объекте администратора
    await this.adminRepository.save(admin); // Сохраняем администратора с новым токеном в базе данных
    return { accessToken }; // Возвращаем токен доступа
  }
  // Метод для логина пользователя
  async loginUser(dto: UserLoginDto): Promise<{ accessToken: string }> {
    const { login, password } = dto; // Извлекаем логин и пароль из DTO
    const user = await this.userRepository.findOne({ where: { login } }); // Ищем пользователя по логину
    if (!user) {
      throw new NotFoundException('Пользователь не найден'); // Если пользователь не найден, выбрасываем исключение
    }
    // Проверяем пароль в открытом виде (замените на хеширование, если необходимо)
    if (user.password !== password) {
      // Проверяем, совпадает ли введенный пароль с паролем пользователя
      throw new UnauthorizedException('Неверный пароль'); // Если пароль неверный, выбрасываем исключение
    }
    const accessToken = this.generateAccessToken(user); // Генерируем токен доступа для пользователя
    user.accessToken = accessToken; // Сохраняем токен доступа в объекте пользователя
    await this.userRepository.save(user); // Сохраняем пользователя с новым токеном в базе данных
    return { accessToken }; // Возвращаем токен доступа
  }
  // Метод для генерации токена доступа
  private generateAccessToken(user: Admin | User): string {
    // Метод принимает администратора или пользователя
    const payload = {
      sub: user.id, // Используем 'sub' для идентификатора пользователя
      login: user.login, // Добавляем логин пользователя в полезную нагрузку
    };
    const jwtSecret = this.configService.get<string>('JWT_SECRET'); // Получаем секрет JWT из конфигурации
    if (!jwtSecret) {
      // Проверяем, установлен ли секрет
      throw new UnauthorizedException( // Если секрет не установлен, выбрасываем исключение
        'JWT_SECRET is not defined in the environment variables', // Сообщение об ошибке
      );
    }
    return jwt.sign(payload, jwtSecret, {
      // Генерируем токен, используя секретный ключ из конфигурации
      expiresIn: '1h', // Устанавливаем срок действия токена на 1 час
    });
  }
}
