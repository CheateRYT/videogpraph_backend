import { Injectable, NotFoundException } from '@nestjs/common'; // Импортируем необходимые декораторы и исключения из NestJS
import { InjectRepository } from '@nestjs/typeorm'; // Импортируем декоратор для внедрения репозиториев из TypeORM
import { Repository } from 'typeorm'; // Импортируем класс Repository из TypeORM для работы с сущностями
import { Photo } from './entity/photo.entity'; // Импортируем сущность Photo
import { CreatePhotoDto, UpdatePhotoDto } from './dto/photo.dto'; // Импортируем DTO для создания и обновления фото
@Injectable() // Декоратор, который делает класс доступным для внедрения зависимостей
export class PhotoService {
  constructor(
    @InjectRepository(Photo) // Внедряем репозиторий для работы с сущностью Photo
    private readonly photoRepository: Repository<Photo>, // Объявляем переменную для репозитория Photo
  ) {}
  // Метод для создания нового фото
  async create(createPhotoDto: CreatePhotoDto): Promise<Photo> {
    // Проверяем, установлен ли порядок для нового фото
    if (createPhotoDto.order === undefined) {
      // Находим фото с наибольшим порядком для данной страницы
      const highestOrderPhoto = await this.photoRepository.findOne({
        where: { pageName: createPhotoDto.pageName }, // Условие поиска по имени страницы
        order: { order: 'DESC' }, // Сортируем по порядку в порядке убывания
      });
      // Устанавливаем порядок для нового фото
      createPhotoDto.order = highestOrderPhoto
        ? highestOrderPhoto.order + 1 // Если фото найдено, увеличиваем порядок на 1
        : 1; // Если фото не найдено, устанавливаем порядок равным 1
    }
    const photo = this.photoRepository.create(createPhotoDto); // Создаем новое фото на основе DTO
    return this.photoRepository.save(photo); // Сохраняем фото в базе данных и возвращаем его
  }
  // Метод для получения всех фото
  async findAll(): Promise<Photo[]> {
    return this.photoRepository.find({
      // Находим все фото
      order: {
        order: 'ASC', // Сортируем по порядку в порядке возрастания
      },
    });
  }
  // Метод для получения фото по имени страницы
  async findByPageName(pageName: string): Promise<Photo[]> {
    const photos = await this.photoRepository.find({
      // Находим фото по имени страницы
      where: { pageName }, // Условие поиска по имени страницы
      order: {
        order: 'ASC', // Сортируем по порядку в порядке возрастания
      },
    });
    if (!photos || photos.length === 0) {
      return []; // Возвращаем пустой массив, если фото не найдены
    }
    return photos; // Возвращаем найденные фото
  }
  // Метод для получения одного фото по его идентификатору
  async findOne(id: number): Promise<Photo> {
    const photo = await this.photoRepository.findOne({ where: { id } }); // Находим фото по идентификатору
    if (!photo) {
      throw new NotFoundException(`Photo with ID ${id} not found`); // Если фото не найдено, выбрасываем исключение
    }
    return photo; // Возвращаем найденное фото
  }
  // Метод для обновления информации о фото
  async update(id: number, updatePhotoDto: UpdatePhotoDto): Promise<Photo> {
    const photo = await this.findOne(id); // Находим фото по идентификатору
    // Проверяем, изменилось ли имя страницы и установлен ли порядок
    if (
      updatePhotoDto.pageName &&
      updatePhotoDto.pageName !== photo.pageName &&
      updatePhotoDto.order === undefined
    ) {
      // Находим фото с наибольшим порядком для новой страницы
      const highestOrderPhoto = await this.photoRepository.findOne({
        where: { pageName: updatePhotoDto.pageName }, // Условие поиска по имени новой страницы
        order: { order: 'DESC' }, // Сортируем по порядку в порядке убывания
      });
      // Устанавливаем порядок для обновляемого фото
      updatePhotoDto.order = highestOrderPhoto
        ? highestOrderPhoto.order + 1 // Если фото найдено, увеличиваем порядок на 1
        : 1; // Если фото не найдено, устанавливаем порядок равным 1
    }
    Object.assign(photo, updatePhotoDto); // Копируем обновленные данные в найденное фото
    return this.photoRepository.save(photo); // Сохраняем обновленное фото и возвращаем его
  }
  // Метод для удаления фото
  async remove(id: number): Promise<void> {
    const photo = await this.findOne(id); // Находим фото по идентификатору
    await this.photoRepository.remove(photo); // Удаляем фото из базы данных
  }
}
