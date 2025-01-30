import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService], 
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: configService.get<string>('TYPEORM_TYPE', 'postgres') as 'postgres',
        host: configService.get<string>('TYPEORM_HOST', 'localhost'),
        port: +configService.get<number>('TYPEORM_PORT', 5432), 
        username: configService.get<string>('TYPEORM_USERNAME'),
        password: configService.get<string>('TYPEORM_PASSWORD'),
        database: configService.get<string>('TYPEORM_DATABASE'),
        autoLoadEntities: configService.get<boolean>('TYPEORM_AUTOLOAD_ENTITIES', true),
        synchronize: configService.get<boolean>('TYPEORM_SYNCHRONIZE', false),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}