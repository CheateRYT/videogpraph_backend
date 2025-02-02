import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Video } from './entities/video.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>, // Добавляем репозиторий для Video
  ) {}

  async getUserVideos(userId: number): Promise<Video[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['videos'],
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user.videos; // Возвращаем все видео пользователя
  }
}
