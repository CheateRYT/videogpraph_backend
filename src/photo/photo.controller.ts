import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotoService } from './photo.service';
import { Photo } from './entity/photo.entity';
import { AdminGuard } from 'src/admin.guard';
@Controller('photos')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}
  // POST /photos/upload – загрузка фото (drag&drop через REST)
  // В теле запроса передается поле isAvatar (например, "true" или "false").

  @Post('upload')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @UploadedFile() file: any,
    @Body('isAvatar') isAvatar: string,
  ): Promise<Photo> {
    // Приводим строковое значение к boolean
    const isAvatarFlag = isAvatar === 'true';
    return await this.photoService.uploadPhoto(file, isAvatarFlag);
  }
  // GET /photos/:id – получение URL фото по id
  @Get(':id')
  async getPhotoUrl(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ url: string }> {
    const url = await this.photoService.getPhotoUrl(id);
    return { url };
  }
  // GET /photos – получение всех фото (пример)
  @Get()
  async getAllPhoto(): Promise<Photo[]> {
    return await this.photoService.getAll();
  }

  // PUT /photos/:id – обновление фото (замена старого файла) с возможностью изменить флаг isAvatar
  @UseGuards(AdminGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updatePhoto(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: any,
    @Body('isAvatar') isAvatar: string,
  ): Promise<Photo> {
    const isAvatarFlag = isAvatar === 'true';
    return await this.photoService.updatePhoto(id, file, isAvatarFlag);
  }
  // DELETE /photos/:id – удаление фото по id
  @UseGuards(AdminGuard)
  @Delete(':id')
  async deletePhoto(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean }> {
    await this.photoService.deletePhoto(id);
    return { success: true };
  }
}