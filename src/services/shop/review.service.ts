import { inject, injectable } from "inversify";
import { BaseService } from "../base/base.service";
import { IReview, ReviewModel } from "@models/shop/review/Review";
import mongoose from "mongoose";
import { Logger } from "@utils/logger";
import { Nullable } from "@ts/types/nullable";

@injectable()
export class ReviewService extends BaseService {
    public constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }

    public async getReviewsByProduct(productId: string): Promise<IReview[]> {
        this.logger.logInfo(`Getting reviews for product with ID: ${productId}`);
        return ReviewModel.find({
            product_id: new mongoose.Types.ObjectId(productId),
        });
    }

    public async getReviewById(reviewId: string): Promise<Nullable<IReview>> {
        this.logger.logInfo(`Getting review with ID: ${reviewId}`);
        return ReviewModel.findById(reviewId);
    }

    public async createReview(reviewData: Partial<IReview>): Promise<IReview> {
        this.logger.logInfo("Creating new review");
        return await ReviewModel.create(reviewData);
    }

    public async getReviewsByUser(userId: string): Promise<IReview[]> {
        this.logger.logInfo(`Getting reviews for user with ID: ${userId}`);
        return ReviewModel.find({ user_id: new mongoose.Types.ObjectId(userId) });
    }

    public async updateReview(
        reviewId: string,
        updatedData: Partial<IReview>,
    ): Promise<Nullable<IReview>> {
        this.logger.logInfo(`Updating review with ID: ${reviewId}`);
        return ReviewModel.findByIdAndUpdate(reviewId, updatedData, { new: true });
    }

    public async deleteReview(reviewId: string): Promise<boolean> {
        this.logger.logInfo(`Deleting review with ID: ${reviewId}`);
        const result = await ReviewModel.deleteOne({ _id: reviewId });
        return result.deletedCount !== 0;
    }
}
