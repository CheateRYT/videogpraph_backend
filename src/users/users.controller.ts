// src/users/users.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { Video } from './entities/video.entity';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('videos')
  async getUserVideos(@Request() req): Promise<Video[]> {
    // Make sure we're getting the userId from the right place
    const userId = req.user.userId;
    console.log('Getting videos for user ID:', userId); // Add logging for debugging
    return this.usersService.getUserVideos(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getUserProfile(@Request() req): Promise<User> {
    // Make sure we're getting the userId from the right place
    const userId = req.user.userId;
    console.log('Getting profile for user ID:', userId); // Add logging for debugging
    return this.usersService.getUserProfile(userId);
  }
}
