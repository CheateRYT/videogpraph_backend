import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminService: AdminService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Токен не предоставлен');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      const admin = await this.adminService.findById(payload.sub); // Предполагается, что у вас есть метод для поиска админа по ID
      if (!admin) {
        throw new UnauthorizedException('Администратор не найден');
      }
      request.user = admin; // Сохраняем информацию о администраторе в запросе
      return true;
    } catch (error) {
      throw new UnauthorizedException(`Недействительный токен + ${error}`, {
        cause: error,
      });
    }
  }
}
