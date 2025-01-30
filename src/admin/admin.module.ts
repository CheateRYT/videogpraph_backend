// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminResolver } from './admin.resolver';
import { Admin } from './admin.entity';
import { AdminSeed } from './admin.seed';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Admin]),
  ],
  providers: [AdminService, AdminResolver, AdminSeed, AuthService, JwtService],
})
export class AdminModule {}