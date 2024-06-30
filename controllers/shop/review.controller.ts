import { inject } from "inversify";
import {
    BaseHttpController,
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
export class ReviewController extends BaseHttpController {
    private readonly reviewService: ReviewService;

    public constructor(@inject(ReviewService) reviewService: ReviewService) {
        super();
        this.reviewService = reviewService;
    }

    @httpGet("/product/:productId")
    public async getReviewsByProduct(request: express.Request) {
        const productId = request.params.productId;
        const reviews = await this.reviewService.getReviewsByProduct(productId);
        return this.json(reviews);
    }

    @httpGet("/:reviewId")
    public async getReview(request: express.Request) {
        const reviewId = request.params.reviewId;
        const review = await this.reviewService.getReviewById(reviewId);
        return this.json(review);
    }

    @httpGet("/user/:userId")
    public async getReviewsByUser(request: express.Request) {
        const userId = request.params.userId;
        const reviews = await this.reviewService.getReviewsByUser(userId);
        return this.json(reviews);
    }

    @httpPost("/")
    public async createReview(request: express.Request) {
        const reviewData = request.body as Partial<IReview>;
        const review = await this.reviewService.createReview(reviewData);
        return this.json(review);
    }

    @httpPut("/:reviewId")
    public async updateReview(request: express.Request) {
        const reviewId = request.params.reviewId;
        const updatedData = request.body as Partial<IReview>;
        const updatedReview = await this.reviewService.updateReview(reviewId, updatedData);
        return this.json(updatedReview);
    }

    @httpDelete("/:reviewId")
    public async deleteReview(request: express.Request) {
        const reviewId = request.params.reviewId;
        const result = await this.reviewService.deleteReview(reviewId);
        return this.json(result);
    }
}

