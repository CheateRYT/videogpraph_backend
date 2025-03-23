import {
    Controller,
    Delete,
    Param,
    ParseIntPipe,
    UseGuards,
  } from '@nestjs/common';
  import { ReviewService } from './review.service';
  import { AdminGuard } from '../admin.guard';
  @Controller('admin/review')
  @UseGuards(AdminGuard)
  export class AdminReviewController {
    constructor(private readonly reviewService: ReviewService) {}
    // Удаление любого отзыва (администратор)
    @Delete(':id')
    async deleteReviewByAdmin(@Param('id', ParseIntPipe) id: number) {
      return { success: await this.reviewService.deleteReviewByAdmin(id) };
    }
  }