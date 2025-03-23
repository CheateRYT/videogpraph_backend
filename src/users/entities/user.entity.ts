import {
  Entity, // Импортируем декоратор Entity из TypeORM для определения сущности
  PrimaryGeneratedColumn, // Импортируем декоратор для автоматической генерации первичного ключа
  Column, // Импортируем декоратор для определения столбцов в сущности
  OneToMany, // Импортируем декоратор для определения связи "один ко многим"
  Admin,
  OneToOne,
  JoinColumn, // Импортируем декоратор Admin (если он используется, возможно, не нужен)
} from 'typeorm'; // Импортируем все декораторы из библиотеки TypeORM
import { Video } from './video.entity'; // Импортируем сущность Video для указания связи
import { Review } from '../../review/review.entity';
@Entity('users') // Определяем сущность User и указываем имя таблицы в базе данных
export class User {
  @PrimaryGeneratedColumn() // Указываем, что этот столбец является первичным ключом с автоматической генерацией
  id: number; // Поле для хранения идентификатора пользователя
  @Column({ unique: true }) // Указываем, что это поле должно быть уникальным в таблице
  login: string; // Поле для хранения логина пользователя
  @Column({ unique: true, nullable: true }) // Указываем, что это поле должно быть уникальным в таблице
  personalData: string; // Личные данные, пример, Артем Желудев @artemTG2025
  @OneToOne(() => Review, (review) => review.user, { cascade: true, nullable: true })
  review: Review | null; // Отзыв
  @Column({ type: 'varchar', nullable: true })
  avatar: string | null; // Колонка для хранения URL аватара
  @Column() // Указываем, что это поле является обычным столбцом
  password: string; // Поле для хранения пароля пользователя
  // Сессионный ключ
  @Column({ nullable: true }) // Указываем, что это поле может быть пустым (nullable)
  accessToken: string; // Поле для хранения токена доступа (сессионного ключа)
  @OneToMany(() => Video, (video) => video.user) // Указываем связь "один ко многим" с сущностью Video
  videos: Video[]; // Поле для хранения массива видео, связанных с пользователем
}
