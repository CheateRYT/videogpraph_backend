import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhotoService } from '../photo/photo.service';
import { User } from '../users/entities/user.entity';
@Injectable()
export class AvatarService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly photoService: PhotoService,
  ) {}
  // Метод для загрузки аватара пользователя
  async uploadAvatar(userId: number, file: any): Promise<string> {
    // Загружаем файл, передавая флаг isAvatar = true
    const photo = await this.photoService.uploadPhoto(file, true);
    // Получаем URL загруженного фото
    const avatarUrl = await this.photoService.getPhotoUrl(photo.id);
    // Находим пользователя и обновляем поле avatar
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    user.avatar = avatarUrl;
    await this.userRepository.save(user);
    return avatarUrl;
  }
  // Метод для удаления аватара пользователя
  async deleteAvatar(userId: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    if (!user.avatar) {
      throw new NotFoundException('Аватар не установлен');
    }
    // Извлекаем fileName из URL (наш URL имеет формат http://localhost:PORT/<fileName>)
    const parts = user.avatar.split('/');
    const fileName = parts[parts.length - 1];
    // Ищем запись фото по fileName
    const photo = await this.photoService.findByFileName(fileName);
    if (photo) {
      await this.photoService.deletePhoto(photo.id);
    }
    user.avatar = null;
    await this.userRepository.save(user);
    return true;
  }
}