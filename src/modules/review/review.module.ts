import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {Offering, OfferingSchema} from "../offering/schemas/offering.schema";
import {Review, ReviewSchema} from "@review/schemas/review.schema";
import {ReviewController} from "@review/controllers/review.controller";
import {ReviewService} from "@review/services/review.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    MongooseModule.forFeature([{ name: Offering.name, schema: OfferingSchema }]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}

