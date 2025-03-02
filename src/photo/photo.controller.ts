import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { AdminGuard } from 'src/admin.guard';
import { CreatePhotoDto, UpdatePhotoDto } from './dto/photo.dto';

@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() createPhotoDto: CreatePhotoDto) {
    return this.photoService.create(createPhotoDto);
  }

  @Get()
  findAll() {
    return this.photoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.photoService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() updatePhotoDto: UpdatePhotoDto) {
    return this.photoService.update(+id, updatePhotoDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.photoService.remove(+id);
  }
}
