import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Video } from './entities/video.entity';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Video]),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Убедитесь, что у вас есть JWT_SECRET в ваших переменных окружения
      signOptions: { expiresIn: '1h' }, // Опции для токена
    }),
  ], // Добавляем сущности
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
