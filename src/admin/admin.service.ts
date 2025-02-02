import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginDto } from 'src/auth/dto/user-login.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}
  async findById(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException('Администратор не найден');
    }
    return admin;
  }
  async registerUser(dto: UserLoginDto): Promise<User> {
    const { login, password } = dto;
    const existingUser = await this.userRepository.findOne({
      where: { login },
    });
    if (existingUser) {
      throw new NotFoundException('Пользователь уже существует');
    }

    const user = new User();
    user.login = login;
    user.password = password; // Сохраняем пароль в открытом виде (не рекомендуется для продакшн)

    return this.userRepository.save(user);
  }
  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
}
