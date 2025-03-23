import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { User } from '../users/entities/user.entity';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  // Создание отзыва для текущего пользователя
  async createReview(userId: number, dto: CreateReviewDto): Promise<Review> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['review'],
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    if (user.review) {
      throw new BadRequestException('Отзыв уже существует');
    }
    const review = this.reviewRepository.create({
      text: dto.text,
      user: user,
    });
    const savedReview = await this.reviewRepository.save(review);
    user.review = savedReview;
    await this.userRepository.save(user);
    return savedReview;
  }

  //Функция для получения всех отзывов
  async getAll(): Promise<Review[]> {
    return await this.reviewRepository.find({relations: {user: true}})
  }
  // Обновление отзыва текущего пользователя
  async updateReview(userId: number, dto: UpdateReviewDto): Promise<Review> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['review'],
    });
    if (!user || !user.review) {
      throw new NotFoundException('Отзыв не найден');
    }
    user.review.text = dto.text;
    return await this.reviewRepository.save(user.review);
  }
  // Удаление отзыва текущего пользователя
  async deleteReview(userId: number): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['review'],
    });
    if (!user || !user.review) {
      throw new NotFoundException('Отзыв не найден');
    }
    await this.reviewRepository.remove(user.review);
    user.review = null;
    await this.userRepository.save(user);
    return true;
  }
  // Удаление отзыва администратором по id отзыва
  async deleteReviewByAdmin(reviewId: number): Promise<boolean> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['user'],
    });
    if (!review) {
      throw new NotFoundException('Отзыв не найден');
    }
    // Если отзыв прикреплён к пользователю – очищаем связь
    if (review.user) {
      review.user.review = null;
      await this.userRepository.save(review.user);
    }
    await this.reviewRepository.remove(review);
    return true;
  }
}