import * as express from "express";
import { inject } from "inversify";
import {
    controller,
    httpGet,
    httpPost,
    httpPut,
    httpDelete,
} from "inversify-express-utils";
import { WishlistService } from "../../services/shop/wishlist.service";

@controller("/wishlist")
export class WishlistController {
    private readonly wishlistService: WishlistService;
    public constructor(
        @inject(WishlistService) wishlistService: WishlistService,
    ) {
        this.wishlistService = wishlistService;
    }

    @httpGet("/")
    public async getWishlist(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const userId = request.body.userId;
            const wishlist = await this.wishlistService.getWishlist(userId);
            response.status(200).json(wishlist);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/")
    public async addProductToWishlist(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const userId = request.body.userId;
            const productId = request.body.productId;
            await this.wishlistService.addProductToWishlist(userId, productId);
            response.status(201).json({ message: "Product added to wishlist" });
        } catch (error) {
            next(error);
        }
    }

    @httpDelete("/")
    public async removeProductFromWishlist(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const userId = request.body.userId;
            const productId = request.body.productId;
            await this.wishlistService.removeProductFromWishlist(userId, productId);
            response.status(200).json({ message: "Product removed from wishlist" });
        } catch (error) {
            next(error);
        }
    }

    @httpPut("/")
    public async updateWishlist(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const userId = request.body.userId;
            const wishlist = request.body.wishlist;
            await this.wishlistService.updateWishlist(userId, wishlist);
            response.status(200).json({ message: "Wishlist updated" });
        } catch (error) {
            next(error);
        }
    }
}
