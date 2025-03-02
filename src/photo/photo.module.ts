import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { Photo } from './entity/photo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminGuard } from 'src/admin.guard';
import { AdminService } from 'src/admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { Admin } from 'src/admin/admin.entity';
import { Video } from 'src/users/entities/video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Photo, User, Admin, Video])],
  controllers: [PhotoController],
  providers: [PhotoService, AdminGuard, AdminService, JwtService],
})
export class PhotoModule {}
