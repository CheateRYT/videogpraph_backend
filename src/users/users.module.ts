import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Video } from './entities/video.entity';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Photo } from '../photo/entity/photo.entity';
import { PhotoService } from '../photo/photo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Video, Photo]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, PhotoService],
})
export class UsersModule {}
