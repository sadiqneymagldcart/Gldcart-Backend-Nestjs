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
import { requireAuth } from "@middlewares/auth.middleware";

@controller("/wishlist")
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
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const wishlist = await this.wishlistService.getWishlistByUser(
                request.params.userId,
            );
            response.status(200).json(wishlist);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/")
    public async addItemToWishlist(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        console.log(request.body);
        try {
            const wishlist = await this.wishlistService.addItemToWishlist(
                request.body.userId,
                request.body.item,
            );
            response.status(201).json(wishlist);
        } catch (error: any) {
            next(error);
        }
    }

    @httpPut("/", requireAuth)
    public async updateWishlistItem(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const wishlist = await this.wishlistService.updateCartItem(
                request.body.userId,
                request.body.productId,
                request.body,
            );
            response.status(200).json(wishlist);
        } catch (error) {
            next(error);
        }
    }

    @httpDelete("/remove-item")
    public async removeItemFromWishlist(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const wishlist = await this.wishlistService.removeItemFromWishlist(
                request.body.userId,
                request.body.productId,
            );
            response.status(200).json(wishlist);
        } catch (error) {
            next(error);
        }
    }
}
