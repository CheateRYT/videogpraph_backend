import { UserLoginDto } from './dto/user-login.dto';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as argon2 from 'argon2'; // Импортируем argon2
import { Admin } from 'src/admin/admin.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async loginAdmin(dto: UserLoginDto): Promise<{ accessToken: string }> {
    const { login, password } = dto;
    const admin = await this.adminRepository.findOne({ where: { login } });
    if (!admin) {
      throw new NotFoundException('Администратор не найден');
    }

    const isPasswordValid = await argon2.verify(admin.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный пароль');
    }

    const accessToken = this.generateAccessToken(admin);
    admin.accessToken = accessToken;
    await this.adminRepository.save(admin);
    return { accessToken };
  }

  async loginUser(dto: UserLoginDto): Promise<{ accessToken: string }> {
    const { login, password } = dto;
    const user = await this.userRepository.findOne({ where: { login } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Проверяем пароль в открытом виде (замените на хеширование, если необходимо)
    if (user.password !== password) {
      throw new UnauthorizedException('Неверный пароль');
    }

    const accessToken = this.generateAccessToken(user);
    user.accessToken = accessToken;
    await this.userRepository.save(user);
    return { accessToken };
  }

  private generateAccessToken(user: Admin | User): string {
    const payload = { sub: user.id, login: user.login };
    return jwt.sign(payload, this.configService.get<string>('JWT_SECRET'), {
      expiresIn: '1h',
    });
  }
}
