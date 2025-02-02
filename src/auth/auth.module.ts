import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';

import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { Admin } from 'src/admin/admin.entity';
import { JwtStrategy } from 'src/jwt.strategy';
import { User } from 'src/users/entities/user.entity';

@Module({
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([Admin, User]),
    ConfigModule.forRoot(), // Убедитесь, что ConfigModule импортирован
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
