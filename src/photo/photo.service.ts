import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createWriteStream, unlink, existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Photo } from './entity/photo.entity';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class PhotoService {
  // Директория для хранения фотографий – папка public в корне проекта
  private uploadDir = join(__dirname, '../../public');

  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
    private readonly configService: ConfigService,
  ) {
    // Проверяем существование директории и создаём её, если отсутствует
    if (!existsSync(this.uploadDir)) {
      try {
        mkdirSync(this.uploadDir, { recursive: true });
      } catch (error) {
        throw new InternalServerErrorException(
          'Не удалось создать директорию для загрузки фотографий',
        );
      }
    }
  }
  // Загрузка фото через REST API. Параметр isAvatar определяет, является ли фото аватаром.
  async uploadPhoto(file: any, isAvatar: boolean): Promise<Photo> {
    // Извлекаем расширение файла (например, .png, .jpeg, .webp)
    const fileExtension = extname(file.originalname);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    const filePath = join(this.uploadDir, uniqueFilename);
    // Записываем файл
    await new Promise<void>((resolve, reject) => {
      const writeStream = createWriteStream(filePath);
      writeStream.on('finish', resolve);
      writeStream.on('error', (err) => {
        reject(
          new InternalServerErrorException(
            'Ошибка при сохранении файла: ' + err.message,
          ),
        );
      });
      writeStream.write(file.buffer);
      writeStream.end();
    });
    // Создаём запись в базе данных с переданным флагом isAvatar
    const photo = this.photoRepository.create({
      fileName: uniqueFilename,
      order: 0,
      isAvatar,
    });
    return await this.photoRepository.save(photo);
  }
  // Получение URL фото по его id
  async getPhotoUrl(id: number): Promise<string> {
    const photo = await this.photoRepository.findOne({ where: { id } });
    if (!photo) {
      throw new NotFoundException('Фото не найдено');
    }
    return `http://localhost:${this.configService.get<number>('PORT') || 3000}/${photo.fileName}`;
  }
  // Обновление фото: удаление старого файла и загрузка нового, а также обновление флага isAvatar
  async updatePhoto(id: number, file: any, isAvatar: boolean): Promise<Photo> {
    const photo = await this.photoRepository.findOne({ where: { id } });
    if (!photo) {
      throw new NotFoundException('Фото не найдено');
    }

    // Удаляем старый файл, если он существует
    const oldPath = join(this.uploadDir, photo.fileName);
    if (existsSync(oldPath)) {
      await new Promise<void>((resolve) => {
        unlink(oldPath, () => resolve());
      });
    }

    // Извлекаем расширение файла и формируем уникальное имя
    const fileExtension = extname(file.originalname);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    const newPath = join(this.uploadDir, uniqueFilename);

    // Записываем новый файл
    await new Promise<void>((resolve, reject) => {
      const writeStream = createWriteStream(newPath);
      writeStream.on('finish', resolve);
      writeStream.on('error', (err) => {
        reject(
          new InternalServerErrorException(
            'Ошибка при сохранении файла: ' + err.message,
          ),
        );
      });
      writeStream.write(file.buffer);
      writeStream.end();
    });

    photo.fileName = uniqueFilename;
    photo.isAvatar = isAvatar;
    return await this.photoRepository.save(photo);
  }
  // Удаление фото по id
  async deletePhoto(id: number): Promise<boolean> {
    const photo = await this.photoRepository.findOne({ where: { id } });
    if (!photo) {
      throw new NotFoundException('Фото не найдено');
    }
    const filePath = join(this.uploadDir, photo.fileName);
    if (existsSync(filePath)) {
      await new Promise<void>((resolve) => {
        unlink(filePath, () => resolve());
      });
    }
    await this.photoRepository.remove(photo);
    return true;
  }
  // Получение всех фото (например, для галереи)
  async getAll(): Promise<Photo[]> {
    const photos = await this.photoRepository.find({
      where: { isAvatar: false },
    });
    return photos;
  }
  // Метод для поиска фото по fileName
  async findByFileName(fileName: string): Promise<Photo | null> {
    return await this.photoRepository.findOne({ where: { fileName } });
  }
}