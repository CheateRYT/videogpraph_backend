import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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

  @Post('add/video')
  async addVideo(@Body() createVideoDto: CreateVideoDto) {
    return this.adminService.addVideoToUser(createVideoDto);
  }

  @Get('users')
  async getUsers() {
    return this.adminService.getUsers();
  }
}
