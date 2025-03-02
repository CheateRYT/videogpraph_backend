import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { Video } from './entities/video.entity';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard) // Используем Guard для проверки JWT
  @Get('videos')
  async getUserVideos(@Request() req): Promise<Video[]> {
    const userId = req.user.userId; // Извлекаем ID пользователя из запроса
    return this.usersService.getUserVideos(userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getUserProfile(@Request() req): Promise<User> {
    const userId = req.user.userId;
    return this.usersService.getUserProfile(userId);
  }
}
