import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/admin/admin.service'; // Импортируйте AdminService для проверки админа, если нужно

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Токен не предоставлен');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload; // Сохраняем полезную нагрузку (payload) в запросе
      return true;
    } catch (error) {
      throw new UnauthorizedException('Недействительный токен');
    }
  }
}
