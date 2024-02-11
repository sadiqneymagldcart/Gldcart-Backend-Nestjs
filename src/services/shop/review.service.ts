import { inject, injectable } from "inversify";
import { BaseService } from "../base.service";
import { Review, ReviewModel } from "../../models/shop/review/Review";
import mongoose from "mongoose";
import { Logger } from "../../utils/logger";

@injectable()
export class ReviewService extends BaseService {
    public constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }

    public async getReviewsByProduct(productId: string): Promise<Review[]> {
        this.logger.logInfo(`Getting reviews for product with ID: ${productId}`);
        return ReviewModel.find({
            product_id: new mongoose.Types.ObjectId(productId),
        });
    }

    public async getReviewById(reviewId: string): Promise<Review | null> {
        this.logger.logInfo(`Getting review with ID: ${reviewId}`);
        return ReviewModel.findById(reviewId);
    }

    public async createReview(reviewData: Partial<Review>): Promise<Review> {
        this.logger.logInfo("Creating new review");
        return await ReviewModel.create(reviewData);
    }

    public async getReviewsByUser(userId: string): Promise<Review[]> {
        this.logger.logInfo(`Getting reviews for user with ID: ${userId}`);
        return ReviewModel.find({ user_id: new mongoose.Types.ObjectId(userId) });
    }

    public async updateReview(
        reviewId: string,
        updatedData: Partial<Review>,
    ): Promise<Review | null> {
        this.logger.logInfo(`Updating review with ID: ${reviewId}`);
        return ReviewModel.findByIdAndUpdate(reviewId, updatedData, { new: true });
    }

    public async deleteReview(reviewId: string): Promise<boolean> {
        this.logger.logInfo(`Deleting review with ID: ${reviewId}`);
        const result = await ReviewModel.deleteOne({ _id: reviewId });
        return result.deletedCount !== 0;
    }
}
