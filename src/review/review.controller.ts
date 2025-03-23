import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Put,
    Request,
    UseGuards,
  } from '@nestjs/common';
  import { ReviewService } from './review.service';
  import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
  @Controller('review')
  export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}
    // Создание отзыва для текущего пользователя
    @UseGuards(JwtAuthGuard)
    @Post()
    async createReview(
      @Request() req,
      @Body() dto: CreateReviewDto,
    ) {
      // req.user.userId предполагается как идентификатор пользователя (проверяется JwtAuthGuard)
      return this.reviewService.createReview(req.user.userId, dto);
    }

    @Get("")
    async getAllReviews() { 
      return this.reviewService.getAll()
    }
    // Обновление отзыва текущего пользователя
    @UseGuards(JwtAuthGuard)
    @Put()
    async updateReview(
      @Request() req,
      @Body() dto: UpdateReviewDto,
    ) {
      return this.reviewService.updateReview(req.user.userId, dto);
    }
    // Удаление отзыва текущего пользователя
    @UseGuards(JwtAuthGuard)
    @Delete()
    async deleteReview(
      @Request() req,
    ) {
      return { success: await this.reviewService.deleteReview(req.user.userId) };
    }
  }