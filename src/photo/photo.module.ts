import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { Photo } from './entity/photo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminGuard } from 'src/admin.guard';
import { AdminService } from 'src/admin/admin.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { Admin } from 'src/admin/admin.entity';
import { Video } from 'src/users/entities/video.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Photo, User, Admin, Video]),
    ConfigModule.forRoot(), // Убедитесь, что ConfigModule загружается
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [PhotoController],
  providers: [PhotoService, AdminGuard, AdminService],
})
export class PhotoModule {}
