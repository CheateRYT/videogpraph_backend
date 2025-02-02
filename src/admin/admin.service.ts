import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginDto } from 'src/auth/dto/user-login.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { Video } from 'src/users/entities/video.entity';
import { CreateVideoDto } from './dto/create-video.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Video) // Добавьте репозиторий для Video
    private readonly videoRepository: Repository<Video>,
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

  async addVideoToUser(createVideoDto: CreateVideoDto): Promise<Video> {
    const { link, userId } = createVideoDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const video = new Video();
    video.link = link;
    video.user = user; // Связываем видео с пользователем

    return this.videoRepository.save(video);
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find({ relations: ['videos'] }); // Получаем пользователей с видео
  }
}
