import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn() //Уникальный айди админа
  id: number;

  @Column({ unique: true }) //Уникальный логин админа
  login: string;

  @Column() // пароль
  password: string;

  @Column() //сессионный ключ
  accessToken: string;
}
