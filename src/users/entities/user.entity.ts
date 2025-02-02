import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Admin,
} from 'typeorm';
import { Video } from './video.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  accessToken: string;
  @OneToMany(() => Video, (video) => video.user) // Указываем связь с видео
  videos?: Video[];
}
