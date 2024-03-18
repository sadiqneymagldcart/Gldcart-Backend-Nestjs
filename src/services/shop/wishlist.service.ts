import { inject, injectable } from "inversify";
import { Logger } from "../../utils/logger";
import {
    WishlistItem,
    WishlistModel,
} from "../../models/shop/wishlist/Wishlist";
import { BaseService } from "../base/base.service";

@injectable()
export class WishlistService extends BaseService {
    public constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }

    public async getWishlistByUser(userId: string) {
        return await WishlistModel.findOne({ userId }).populate("items.productId");
    }

    public async addItemToWishlist(userId: string, item: WishlistItem) {
        const existingCart = await WishlistModel.findOne({ userId });
        if (!existingCart) {
            return await WishlistModel.create({ userId, items: [item] });
        }
        const existingItemIndex = existingCart.items.findIndex(
            (cartItem) => cartItem.productId.toString() === item.productId.toString(),
        );
        if (existingItemIndex !== -1) {
            return await existingCart.save();
        }
        existingCart.items.push(item);
        return await existingCart.save();
    }
    public async updateCartItem(
        userId: string,
        productId: string,
        item: WishlistItem,
    ) {
        this.logger.logInfo(`Updating item in wishlist for user ${userId}`);
        return await WishlistModel.findOneAndUpdate(
            { userId, "items.product": productId },
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
