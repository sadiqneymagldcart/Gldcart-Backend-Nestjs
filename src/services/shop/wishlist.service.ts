import { inject, injectable } from "inversify";
import { BaseService } from "../base.service";
import { Logger } from "../../utils/logger";
import {
    WishlistItem,
    WishlistModel,
} from "../../models/shop/wishlist/Wishlist";

@injectable()
export class WishlistService extends BaseService {
    public constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }

    public async getWishlistByUser(userId: string) {
        return await WishlistModel.findOne({ userId });
    }
    public async addItemToCart(userId: string, item: WishlistItem) {
        return await WishlistModel.findOneAndUpdate(
            { userId },
            { $push: { items: item } },
            { new: true, upsert: true },
        );
    }

    public async updateCartItem(
        userId: string,
        productId: string,
        item: WishlistItem,
    ) {
        return await WishlistModel.findOneAndUpdate(
            { userId, "items.productId": productId },
            { $set: { "items.$": item } },
            { new: true },
        );
    }
    public async removeItemFromWishlist(userId: string, productId: string) {
        return await WishlistModel.findOneAndUpdate(
            { userId },
            { $pull: { items: { productId } } },
            { new: true },
        );
    }
}
