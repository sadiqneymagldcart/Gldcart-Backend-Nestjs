import { Controller } from '@nestjs/common';
import { ReviewService } from '../services/review.service';

@Controller('review')
export class ReviewController {
  public constructor(private readonly reviewService: ReviewService) {}
}
