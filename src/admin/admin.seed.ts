import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2'; // Импортируем argon2
import { Admin } from 'src/admin/admin.entity';

@Injectable()
export class AdminSeed {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly configService: ConfigService,
  ) {}

  async createAdmin() {
    const existingAdmin = await this.adminRepository.findOne({
      where: { login: this.configService.get<string>('ADMIN_LOGIN') },
    });

    const adminLogin = this.configService.get<string>('ADMIN_LOGIN');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    if (!adminLogin) {
      throw new Error('Заполните env: ADMIN_LOGIN');
    }
    if (!adminPassword) {
      throw new Error('Заполните env: ADMIN_PASSWORD');
    }

    if (!existingAdmin) {
      const admin = new Admin();
      admin.login = adminLogin;
      admin.password = await argon2.hash(adminPassword); // Хешируем пароль
      admin.accessToken = '';

      await this.adminRepository.save(admin);
      console.log('Admin created:', admin);
    } else {
      console.log('Admin already exists:', existingAdmin);
    }
  }
}
