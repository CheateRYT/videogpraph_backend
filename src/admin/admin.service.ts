import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import * as argon2 from 'argon2';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    public adminsRepository: Repository<Admin>, // Сделаем репозиторий публичным
  ) {}

  async findAdminByLogin(login: string): Promise<Admin | null> {
    return this.adminsRepository.findOneBy({ login });
  }

  async updatePassword(id: number, newPassword: string): Promise<Admin> {
    const admin = await this.adminsRepository.findOneBy({ id });
    if (!admin) {
      throw new Error('Admin not found');
    }
    const hashedPassword = await argon2.hash(newPassword);
    admin.password = hashedPassword;
    return this.adminsRepository.save(admin);
  }
}