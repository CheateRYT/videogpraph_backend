import { Controller, Post, Delete, UploadedFile, UseInterceptors, Request, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { AvatarService } from './avatar.service';
@Controller('users/avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}
  // POST /users/avatar/upload – загрузка аватара (drag & drop)
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@UploadedFile() file: any, @Request() req): Promise<{ avatarUrl: string }> {
    const userId = req.user.userId;
    const avatarUrl = await this.avatarService.uploadAvatar(userId, file);
    return { avatarUrl };
  }
  // DELETE /users/avatar – удаление аватара пользователя
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteAvatar(@Request() req): Promise<{ success: boolean }> {
    const userId = req.user.userId;
    const success = await this.avatarService.deleteAvatar(userId);
    return { success };
  }
}