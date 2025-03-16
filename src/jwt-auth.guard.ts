import {
  Injectable, // Импортируем декоратор Injectable для определения сервиса
  CanActivate, // Импортируем интерфейс CanActivate для создания защитника маршрутов
  ExecutionContext, // Импортируем ExecutionContext для получения информации о текущем запросе
  UnauthorizedException, // Импортируем исключение для обработки случаев, когда доступ несанкционирован
} from '@nestjs/common'; // Импортируем необходимые модули из NestJS
import { JwtService } from '@nestjs/jwt'; // Импортируем сервис для работы с JWT
import { ConfigService } from '@nestjs/config'; // Импортируем сервис конфигурации для доступа к переменным окружения
@Injectable() // Декоратор, который делает класс доступным для внедрения зависимостей
export class JwtAuthGuard implements CanActivate {
  // Класс JwtAuthGuard реализует интерфейс CanActivate
  constructor(
    private readonly jwtService: JwtService, // Внедряем сервис для работы с JWT
    private readonly configService: ConfigService, // Внедряем сервис конфигурации для доступа к переменным окружения
  ) {}
  // Метод для проверки, может ли текущий запрос быть обработан
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest(); // Получаем текущий HTTP-запрос
    const token = this.extractTokenFromHeader(request); // Извлекаем токен из заголовка запроса
    if (!token) {
      throw new UnauthorizedException('Токен не предоставлен'); // Если токен отсутствует, выбрасываем исключение
    }
    try {
      // Получаем секрет JWT из конфигурации
      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        throw new Error('JWT_SECRET not configured'); // Если секрет не настроен, выбрасываем ошибку
      }
      // Проверяем токен с использованием секрета
      const payload = await this.jwtService.verifyAsync(token, { secret });
      // Сохраняем декодированную полезную нагрузку в объекте запроса
      // Убедитесь, что используем правильные имена свойств из токена
      request.user = {
        userId: payload.sub, // Это должно соответствовать тому, как вы создаете токен
        login: payload.login, // Извлекаем логин из полезной нагрузки
      };
      return true; // Возвращаем true, если токен действителен
    } catch (error) {
      throw new UnauthorizedException(
        `Недействительный токен: ${error.message}`, // Если токен недействителен, выбрасываем исключение с сообщением об ошибке
      );
    }
  }
  // Приватный метод для извлечения токена из заголовка запроса
  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []; // Извлекаем тип и токен из заголовка authorization
    return type === 'Bearer' ? token : undefined; // Возвращаем токен, если тип Bearer
  }
}
