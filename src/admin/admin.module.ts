import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { AdminSeed } from './admin.seed';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminController } from './admin.controller';
import { JwtModule } from '@nestjs/jwt';
import { AdminService } from './admin.service';
import { User } from 'src/users/entities/user.entity';
import { Video } from 'src/users/entities/video.entity';

@Module({
  imports: [
    ConfigModule.forRoot(), // Убедитесь, что ConfigModule загружается
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Admin, User, Video]),
  ],
  providers: [AdminSeed, AdminService],
  controllers: [AdminController],
})
export class AdminModule implements OnModuleInit {
  constructor(private readonly adminSeed: AdminSeed) {}

  async onModuleInit() {
    await this.adminSeed.createAdmin();
  }
}
