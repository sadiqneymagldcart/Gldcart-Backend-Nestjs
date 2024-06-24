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
import { SerializeWith } from '@shared/decorators/serialize.decorator';
import { Review } from '@review/schemas/review.schema';
import { ReviewService } from '@review/services/review.service';
import { CreateReviewDto } from '@review/dto/create-review.dto';
import { UpdateReviewDto } from '@review/dto/update-review.dto';

@ApiTags('Reviews')
@Controller('/reviews')
@SerializeWith(Review)
export class ReviewController {
  private readonly logger: Logger = new Logger(ReviewController.name);

  public constructor(private readonly reviewService: ReviewService) { }

  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({ status: 200, description: 'Reviews found', type: [Review] })
  @HttpCode(HttpStatus.OK)
  @Get()
  public async findAll(): Promise<Review[]> {
    this.logger.log('REST request to get all reviews');
    return await this.reviewService.findAll();
  }

  @ApiOperation({ summary: 'Get review by id' })
  @ApiResponse({ status: 200, description: 'Review found', type: Review })
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  public async findOne(@Param('id') id: string): Promise<Review> {
    this.logger.log(`REST request to get a review: ${id}`);
    return this.reviewService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a review' })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({ status: 201, description: 'Review created', type: Review })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  public async create(
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    this.logger.log(
      `REST request to create a review: ${JSON.stringify(createReviewDto)}`,
    );
    return this.reviewService.create(createReviewDto);
  }

  @ApiOperation({ summary: 'Update a review by id' })
  @ApiBody({ type: UpdateReviewDto })
  @ApiResponse({ status: 200, description: 'Review updated', type: Review })
  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  public async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    this.logger.log(`REST request to update a review: ${id}`);
    return this.reviewService.update(id, updateReviewDto);
  }

  @ApiOperation({ summary: 'Delete a review by id' })
  @ApiResponse({ status: 204, description: 'Review deleted' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  public async remove(@Param('id') id: string): Promise<void> {
    this.logger.log(`REST request to delete a review: ${id}`);
    return this.reviewService.remove(id);
  }
}
