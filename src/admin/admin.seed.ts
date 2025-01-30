import { Injectable } from '@nestjs/common';
import { AdminService } from './admin.service';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { Admin } from './admin.entity';

@Injectable()
export class AdminSeed {
  constructor(
    private readonly adminService: AdminService,
    private readonly configService: ConfigService,
  ) {}

  async seed() {
    const login = this.configService.get<string>('ADMIN_LOGIN');
    const password = this.configService.get<string>('ADMIN_PASSWORD');

    if (!login || !password) {
      console.log('Admin credentials not provided in .env file');
      return;
    }

    const hashedPassword = await argon2.hash(password);

    const existingAdmin = await this.adminService.findAdminByLogin(login);
    if (!existingAdmin) {
      const admin = new Admin();
      admin.login = login;
      admin.password = hashedPassword;
      await this.adminService.adminsRepository.save(admin);
      console.log('Admin seeded successfully');
    } else {
      console.log('Admin already exists');
    }
  }
}