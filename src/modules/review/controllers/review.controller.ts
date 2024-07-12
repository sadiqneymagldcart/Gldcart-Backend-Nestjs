import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Review } from '@review/schemas/review.schema';
import { ReviewService } from '@review/services/review.service';
import { CreateReviewDto } from '@review/dto/create-review.dto';
import { UpdateReviewDto } from '@review/dto/update-review.dto';

@ApiTags('Reviews')
@Controller('/reviews')
export class ReviewController {
  private readonly logger: Logger = new Logger(ReviewController.name);

  public constructor(private readonly reviewService: ReviewService) {}

  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({ status: 200, description: 'Reviews found', type: [Review] })
  @HttpCode(HttpStatus.OK)
  @Get()
  public async getAllReviews(): Promise<Review[]> {
    this.logger.log('REST request to get all reviews');
    return await this.reviewService.getAllReviews();
  }

  @ApiOperation({ summary: 'Get review by id' })
  @ApiResponse({ status: 200, description: 'Review found', type: Review })
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  public async getReviewById(@Param('id') id: string): Promise<Review> {
    this.logger.log(`REST request to get a review: ${id}`);
    return this.reviewService.getReviewById(id);
  }

  @ApiOperation({ summary: 'Create a review' })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({ status: 201, description: 'Review created', type: Review })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  public async createReview(
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    this.logger.log(
      `REST request to create a review: ${JSON.stringify(createReviewDto)}`,
    );
    return this.reviewService.createReview(createReviewDto);
  }

  @ApiOperation({ summary: 'Update a review by id' })
  @ApiBody({ type: UpdateReviewDto })
  @ApiResponse({ status: 200, description: 'Review updated', type: Review })
  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  public async updateReview(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    this.logger.log(`REST request to update a review: ${id}`);
    return this.reviewService.updateReview(id, updateReviewDto);
  }

  @ApiOperation({ summary: 'Delete a review by id' })
  @ApiResponse({ status: 204, description: 'Review deleted' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  public async removeReview(@Param('id') id: string): Promise<void> {
    this.logger.log(`REST request to delete a review: ${id}`);
    return this.reviewService.removeReview(id);
  }
}
