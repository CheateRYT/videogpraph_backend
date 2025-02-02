import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  link: string;

  @ManyToOne(() => User, (user) => user.videos) // Указываем связь с пользователем
  user: User;
}
