import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'; // Импортируем необходимые декораторы из библиотеки TypeORM
import { User } from './user.entity'; // Импортируем сущность User для указания связи
@Entity('videos') // Определяем сущность Video и указываем имя таблицы в базе данных
export class Video {
  @PrimaryGeneratedColumn() // Указываем, что этот столбец является первичным ключом с автоматической генерацией
  id: number; // Поле для хранения идентификатора видео
  @Column() // Указываем, что это поле является обычным столбцом
  link: string; // Поле для хранения ссылки на видео
  @ManyToOne(() => User, (user) => user.videos) // Указываем связь "многие к одному" с сущностью User
  user: User; // Поле для хранения информации о пользователе, которому принадлежит это видео
}
