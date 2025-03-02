import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserLoginDto } from 'src/auth/dto/user-login.dto';
import { AdminGuard } from 'src/admin.guard';
import { CreateVideoDto } from './dto/create-video.dto';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('register/user')
  async registerUser(@Body() dto: UserLoginDto) {
    return this.adminService.registerUser(dto);
  }

  @Post('add/video/:userId')
  async addVideo(
    @Param('userId') userId: number,
    @Body() createVideoDto: CreateVideoDto,
  ) {
    return this.adminService.addVideoToUser(userId, createVideoDto);
  }

  @Get('users')
  async getUsers() {
    return this.adminService.getUsers();
  }
  @Get('users/:id')
  async getUserById(@Param('id') id: number) {
    return this.adminService.findById(id);
  }
  @Delete('users/:id') // Удаление пользователя по ID
  async deleteUser(@Param('id') id: number) {
    return this.adminService.deleteUserById(id);
  }

  @Delete('users/:userId/videos/:videoId') // Удаление видео по ID пользователя и ID видео
  async deleteVideo(
    @Param('userId') userId: number,
    @Param('videoId') videoId: number,
  ) {
    return this.adminService.deleteVideo(userId, videoId);
  }
}
