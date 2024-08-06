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
@Controller('reviews')
export class ReviewController {
  private readonly logger: Logger = new Logger(ReviewController.name);

  public constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({ status: 200, description: 'Reviews found', type: [Review] })
  @HttpCode(HttpStatus.OK)
  public async getAllReviews(): Promise<Review[]> {
    this.logger.log('REST request to get all reviews');
    return this.reviewService.getAllReviews();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review by id' })
  @ApiResponse({ status: 200, description: 'Review found', type: Review })
  @HttpCode(HttpStatus.OK)
  public async getReviewById(@Param('id') id: string): Promise<Review> {
    this.logger.log(`REST request to get a review: ${id}`);
    return this.reviewService.getReviewById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a review' })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({ status: 201, description: 'Review created', type: Review })
  @HttpCode(HttpStatus.CREATED)
  public async createReview(
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    this.logger.log(
      `REST request to create a review: ${JSON.stringify(createReviewDto)}`,
    );
    return this.reviewService.createReview(createReviewDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a review by id' })
  @ApiBody({ type: UpdateReviewDto })
  @ApiResponse({ status: 200, description: 'Review updated', type: Review })
  @HttpCode(HttpStatus.OK)
  public async updateReview(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    this.logger.log(`REST request to update a review: ${id}`);
    return this.reviewService.updateReview(id, updateReviewDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a review by id' })
  @ApiResponse({ status: 204, description: 'Review deleted' })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async removeReview(@Param('id') id: string): Promise<void> {
    this.logger.log(`REST request to delete a review: ${id}`);
    return this.reviewService.removeReview(id);
  }
}
