// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './dto/token.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateAdmin(login: string, password: string): Promise<any> {
    const admin = await this.adminService.findAdminByLogin(login);
    if (admin && (await argon2.verify(admin.password, password))) {
      const { password, ...result } = admin;
      return result;
    }
    return null;
  }

  async login(admin: any): Promise<Tokens> {
    const payload = { login: admin.login, sub: admin.id };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.generateRefreshToken(admin.id),
    };
  }

  generateRefreshToken(id: number): string {
    return this.jwtService.sign({ id }, { secret: this.configService.get<string>('JWT_REFRESH_SECRET'), expiresIn: '7d' });
  }

  async refreshTokens(refreshToken: string): Promise<Tokens> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const admin = await this.adminService.findAdminByLogin(payload.login);
      if (!admin) {
        throw new Error('Admin not found');
      }
      return this.login(admin);
    } catch {
      throw new Error('Invalid refresh token');
    }
  }
}