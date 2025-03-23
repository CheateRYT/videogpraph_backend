import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { User } from '../users/entities/user.entity';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { AdminReviewController } from './review-admin.controller';
import {  JwtModule, JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/admin/admin.service';
import { AdminModule } from 'src/admin/admin.module';
import { UsersModule } from 'src/users/users.module';
import { Admin } from 'src/admin/admin.entity';
import { Video } from 'src/users/entities/video.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    TypeOrmModule.forFeature([Review, User, Admin, Video]),
     ConfigModule.forRoot(), 
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: '1h' },
          }),
          inject: [ConfigService],
        }),
  ],
  providers: [ReviewService, AdminService],
  controllers: [ReviewController, AdminReviewController],
})
export class ReviewModule {}