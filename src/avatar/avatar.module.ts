import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoModule } from '../photo/photo.module';
import { AvatarService } from './avatar.service';
import { AvatarController } from './avatar.controller';
import { User } from '../users/entities/user.entity';
import { Photo } from 'src/photo/entity/photo.entity';
import { PhotoService } from 'src/photo/photo.service';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [TypeOrmModule.forFeature([User, Photo]), PhotoModule],
  providers: [AvatarService, PhotoService, JwtService],
  controllers: [AvatarController],
  exports: [AvatarService],
})
export class AvatarModule {}