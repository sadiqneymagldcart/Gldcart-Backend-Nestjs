import {inject} from "inversify";
import {controller, httpDelete, httpGet, httpPost, httpPut,} from "inversify-express-utils";
import {ReviewService} from "../../services/shop/review.service";
import {Review} from "../../models/shop/Review";
import * as express from "express";

@controller("/review")
export class ReviewController {
    private readonly reviewService: ReviewService;

    public constructor(@inject(ReviewService) reviewService: ReviewService) {
        this.reviewService = reviewService;
    }

    @httpGet("/:productId")
    public async getReviewsByProduct(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const productId = request.params.productId;
            const review = this.reviewService.getReviewsByProduct(productId);
            response.status(200).json(review);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/:reviewId")
    public async getReviewById(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const reviewId = request.params.reviewId;
            const review = this.reviewService.getReviewById(reviewId);
            response.status(200).json(review);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/:userId")
    public async getReviewsByUser(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const userId = request.params.userId;
            const review = this.reviewService.getReviewsByUser(userId);
            response.status(200).json(review);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/")
    public async createReview(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const reviewData = request.body as Partial<Review>;
            const review = this.reviewService.createReview(reviewData);
            response.status(201).json(review);
        } catch (error) {
            next(error);
        }
    }

    @httpPut("/:reviewId")
    public async updateReview(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const reviewId = request.params.reviewId;
            const updatedData = request.body as Partial<Review>;
            const review = this.reviewService.updateReview(reviewId, updatedData);
            response.status(200).json(review);
        } catch (error) {
            next(error);
        }
    }

    @httpDelete("/:reviewId")
    public async deleteReview(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const reviewId = request.params.reviewId;
            const result = this.reviewService.deleteReview(reviewId);
            response.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("")
    public async() {
    }
}
