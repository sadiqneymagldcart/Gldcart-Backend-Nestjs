import * as express from "express";
import { inject } from "inversify";
import {
    controller,
    httpGet,
    httpPost,
    httpPut,
    httpDelete,
    BaseHttpController,
} from "inversify-express-utils";
import { WishlistService } from "@services/shop/wishlist.service";
import { AuthenticationMiddleware } from "@middlewares/authentication.middleware";

@controller("/wishlist", AuthenticationMiddleware)
export class WishlistController extends BaseHttpController {
    private readonly wishlistService: WishlistService;

    public constructor(
        @inject(WishlistService) wishlistService: WishlistService,
    ) {
        super();
        this.wishlistService = wishlistService;
    }

    @httpGet("/:userId")
    public async getWishlist(request: express.Request) {
        const { userId } = request.params;
        const wishlist = await this.wishlistService.getWishlistByUser(userId);
        return this.json(wishlist);
    }

    @httpPost("/")
    public async addItemToWishlist(request: express.Request) {
        const { userId, item } = request.body;
        const updatedWishlist = await this.wishlistService.addItemToWishlist(
            userId,
            item,
        );
        return this.json(updatedWishlist);
    }

    @httpPut("/")
    public async updateWishlistItem(request: express.Request) {
        const { userId, productId, item } = request.body;
        const updatedWishlist = await this.wishlistService.updateCartItem(
            userId,
            productId,
            item,
        );
        return this.json(updatedWishlist);
    }

    @httpDelete("/remove-item")
    public async removeItemFromWishlist(request: express.Request) {
        const { userId, productId } = request.body;
        const updatedWishlist = await this.wishlistService.removeItemFromWishlist(
            userId,
            productId,
        );
        return this.json(updatedWishlist);
    }
}
