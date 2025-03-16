import { Injectable, UnauthorizedException } from '@nestjs/common'; // Импортируем необходимые декораторы и исключения из NestJS
import { PassportStrategy } from '@nestjs/passport'; // Импортируем класс PassportStrategy для создания стратегии аутентификации
import { ExtractJwt, Strategy } from 'passport-jwt'; // Импортируем функции для извлечения JWT и класс Strategy из passport-jwt
import { ConfigService } from '@nestjs/config'; // Импортируем сервис конфигурации для доступа к переменным окружения
@Injectable() // Декоратор, который делает класс доступным для внедрения зависимостей
export class JwtStrategy extends PassportStrategy(Strategy) {
  // Класс JwtStrategy наследует от PassportStrategy и использует стратегию JWT
  constructor(private readonly configService: ConfigService) {
    // Конструктор, в который внедряется ConfigService
    const jwtSecret = configService.get<string>('JWT_SECRET'); // Получаем секрет JWT из конфигурации
    if (!jwtSecret) {
      // Проверяем, установлен ли секрет
      throw new UnauthorizedException( // Если секрет не установлен, выбрасываем исключение
        'JWT_SECRET is not defined in the environment variables', // Сообщение об ошибке
      );
    }
    super({
      // Вызываем конструктор родительского класса PassportStrategy
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Указываем, откуда извлекать JWT (из заголовка Authorization с типом Bearer)
      ignoreExpiration: false, // Указываем, что не нужно игнорировать срок действия токена
      secretOrKey: jwtSecret, // Указываем секретный ключ для проверки токена
    });
  }
  // Метод для валидации полезной нагрузки (payload) токена
  async validate(payload: any) {
    return { userId: payload.sub, login: payload.login }; // Возвращаем объект с идентификатором пользователя и логином
  }
}
