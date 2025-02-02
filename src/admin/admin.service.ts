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
    @InjectRepository(Video)
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
    const existingUser = await this.userRepository.findOne({
      where: { login: dto.login },
    });

    if (existingUser) {
      throw new NotFoundException('Пользователь уже существует');
    }

    const user = this.userRepository.create({
      login: dto.login,
      password: dto.password, // Сохраняем пароль в открытом виде (не рекомендуется для продакшн)
    });

    return this.userRepository.save(user);
  }

  async addVideoToUser(createVideoDto: CreateVideoDto): Promise<Video> {
    const user = await this.getUserById(createVideoDto.userId);

    const video = this.videoRepository.create({
      link: createVideoDto.link,
      user: user,
    });

    return this.videoRepository.save(video);
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find({ relations: ['videos'] }); // Получаем пользователей с видео
  }

  async deleteUserById(id: number): Promise<void> {
    const user = await this.getUserById(id);
    await this.userRepository.remove(user);
  }

  async deleteVideo(userId: number, videoId: number): Promise<void> {
    const user = await this.getUserById(userId);

    const video = await this.videoRepository.findOne({
      where: { id: videoId, user },
    });

    if (!video) {
      throw new NotFoundException('Видео не найдено');
    }

    await this.videoRepository.remove(video);
  }

  private async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }
}
