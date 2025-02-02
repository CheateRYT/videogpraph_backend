import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/admin')
  async loginAdmin(@Body() dto: UserLoginDto) {
    return this.authService.loginAdmin(dto);
  }
  @Post('login')
  async loginUser(@Body() dto: UserLoginDto) {
    return this.authService.loginUser(dto);
  }
}
