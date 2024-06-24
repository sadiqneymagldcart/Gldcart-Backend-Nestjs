import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateReviewDto } from '@review/dto/create-review.dto';
import { UpdateReviewDto } from '@review/dto/update-review.dto';
import { Review, ReviewDocument } from '@review/schemas/review.schema';
import { Model } from 'mongoose';

@Injectable()
export class ReviewService {
    constructor(
        @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    ) {}

    async create(createReviewDto: CreateReviewDto): Promise<Review> {
        const createdReview = new this.reviewModel(createReviewDto);
        return createdReview.save();
    }

    async findAll(): Promise<Review[]> {
        return this.reviewModel.find().exec();
    }

    async findOne(id: string): Promise<Review> {
        const review = await this.reviewModel.findById(id).exec();
        if (!review) {
            throw new NotFoundException(`Review with ID ${id} not found`);
        }
        return review;
    }

    async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
        const existingReview = await this.reviewModel.findByIdAndUpdate(id, updateReviewDto, { new: true }).exec();
        if (!existingReview) {
            throw new NotFoundException(`Review with ID ${id} not found`);
        }
        return existingReview;
    }

    async remove(id: string): Promise<void> {
        const result = await this.reviewModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Review with ID ${id} not found`);
        }
    }
}

