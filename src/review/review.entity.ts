import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { User } from '../users/entities/user.entity';
  @Entity('reviews')
  export class Review {
    @PrimaryGeneratedColumn()
    id: number;
    // Текст отзыва до 350 символов
    @Column({ type: 'varchar', length: 350 })
    text: string;
    @CreateDateColumn({ type: 'datetime' }) // заменили "timestamp" на "datetime"
    createdAt: Date;
    @UpdateDateColumn({ type: 'datetime' }) // заменили "timestamp" на "datetime"
    updatedAt: Date;
    @OneToOne(() => User, (user) => user.review)
    @JoinColumn()
    user: User;
  }