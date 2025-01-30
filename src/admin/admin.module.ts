import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminResolver } from './admin.resolver';
import { Admin } from './admin.entity';
import { AdminSeed } from './admin.seed';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Admin]),
  ],
  providers: [AdminService, AdminResolver, AdminSeed],
})
export class AdminModule {}