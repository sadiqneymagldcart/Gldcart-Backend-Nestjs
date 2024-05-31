import * as express from "express";
import { inject } from "inversify";
import {
    controller,
    httpGet,
    httpPost,
    httpPut,
    httpDelete,
    Controller,
} from "inversify-express-utils";
import { WishlistService } from "@services/shop/wishlist.service";
import { AuthenticationMiddleware } from "@middlewares/authentication.middleware";

@controller("/wishlist", AuthenticationMiddleware)
export class WishlistController implements Controller {
    private readonly wishlistService: WishlistService;

    public constructor(
        @inject(WishlistService) wishlistService: WishlistService,
    ) {
        this.wishlistService = wishlistService;
    }

    @httpGet("/:userId")
    public async getWishlist(
        request: express.Request,
        next: express.NextFunction,
    ) {
        const { userId } = request.params;
        try {
            return await this.wishlistService.getWishlistByUser(userId);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/")
    public async addItemToWishlist(
        request: express.Request,
        next: express.NextFunction,
    ) {
        const { userId, item } = request.body;
        try {
            return await this.wishlistService.addItemToWishlist(userId, item);
        } catch (error: any) {
            next(error);
        }
    }

    @httpPut("/")
    public async updateWishlistItem(
        request: express.Request,
        next: express.NextFunction,
    ) {
        const { userId, productId, item } = request.body;
        try {
            return await this.wishlistService.updateCartItem(userId, productId, item);
        } catch (error) {
            next(error);
        }
    }

    @httpDelete("/remove-item")
    public async removeItemFromWishlist(
        request: express.Request,
        next: express.NextFunction,
    ) {
        const { userId, productId } = request.body;
        try {
            return await this.wishlistService.removeItemFromWishlist(
                userId,
                productId,
            );
        } catch (error) {
            next(error);
        }
    }
}
