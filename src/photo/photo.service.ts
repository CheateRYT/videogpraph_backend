import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './entity/photo.entity';
import { CreatePhotoDto, UpdatePhotoDto } from './dto/photo.dto';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  async create(createPhotoDto: CreatePhotoDto): Promise<Photo> {
    if (createPhotoDto.order === undefined) {
      const highestOrderPhoto = await this.photoRepository.findOne({
        where: { pageName: createPhotoDto.pageName },
        order: { order: 'DESC' },
      });

      createPhotoDto.order = highestOrderPhoto
        ? highestOrderPhoto.order + 1
        : 1;
    }

    const photo = this.photoRepository.create(createPhotoDto);
    return this.photoRepository.save(photo);
  }

  async findAll(): Promise<Photo[]> {
    return this.photoRepository.find({
      order: {
        order: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Photo> {
    const photo = await this.photoRepository.findOne({ where: { id } });
    if (!photo) {
      throw new NotFoundException(`Photo with ID ${id} not found`);
    }
    return photo;
  }

  async update(id: number, updatePhotoDto: UpdatePhotoDto): Promise<Photo> {
    const photo = await this.findOne(id);

    if (
      updatePhotoDto.pageName &&
      updatePhotoDto.pageName !== photo.pageName &&
      updatePhotoDto.order === undefined
    ) {
      const highestOrderPhoto = await this.photoRepository.findOne({
        where: { pageName: updatePhotoDto.pageName },
        order: { order: 'DESC' },
      });

      updatePhotoDto.order = highestOrderPhoto
        ? highestOrderPhoto.order + 1
        : 1;
    }

    Object.assign(photo, updatePhotoDto);

    return this.photoRepository.save(photo);
  }

  async remove(id: number): Promise<void> {
    const photo = await this.findOne(id);
    await this.photoRepository.remove(photo);
  }
}
