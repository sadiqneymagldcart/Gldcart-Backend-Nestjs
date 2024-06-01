import { inject } from "inversify";
import {
    Controller,
    controller,
    httpDelete,
    httpGet,
    httpPost,
    httpPut,
} from "inversify-express-utils";
import { ReviewService } from "@services/shop/review.service";
import * as express from "express";
import { IReview } from "@models/shop/review/Review";
import { AuthenticationMiddleware } from "@middlewares/authentication.middleware";

@controller("/review", AuthenticationMiddleware)
export class ReviewController implements Controller {
    private readonly reviewService: ReviewService;

    public constructor(@inject(ReviewService) reviewService: ReviewService) {
        this.reviewService = reviewService;
    }

    @httpGet("/:productId")
    public async getReviewsByProduct(
        request: express.Request,
        next: express.NextFunction,
    ) {
        const productId = request.params.productId;
        try {
            return this.reviewService.getReviewsByProduct(productId);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/:reviewId")
    public async getReview(request: express.Request, next: express.NextFunction) {
        const reviewId = request.params.reviewId;
        try {
            return this.reviewService.getReviewById(reviewId);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/:userId")
    public async getReviewsByUser(
        request: express.Request,
        next: express.NextFunction,
    ) {
        const userId = request.params.userId;
        try {
            return this.reviewService.getReviewsByUser(userId);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/")
    public async createReview(
        request: express.Request,
        next: express.NextFunction,
    ) {
        const reviewData = request.body as Partial<IReview>;
        try {
            return this.reviewService.createReview(reviewData);
        } catch (error) {
            next(error);
        }
    }

    @httpPut("/:reviewId")
    public async updateReview(
        request: express.Request,
        next: express.NextFunction,
    ) {
        const reviewId = request.params.reviewId;
        const updatedData = request.body as Partial<IReview>;
        try {
            return this.reviewService.updateReview(reviewId, updatedData);
        } catch (error) {
            next(error);
        }
    }

    @httpDelete("/:reviewId")
    public async deleteReview(
        request: express.Request,
        next: express.NextFunction,
    ) {
        const reviewId = request.params.reviewId;
        try {
            return this.reviewService.deleteReview(reviewId);
        } catch (error) {
            next(error);
        }
    }
}
