import { inject, injectable } from "inversify";
import { Logger } from "@utils/logger";
import { IWishlistItem, WishlistModel } from "@models/shop/wishlist/Wishlist";
import { BaseService } from "../base/base.service";

@injectable()
export class WishlistService extends BaseService {
    public constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }

    public async getWishlistByUser(userId: string) {
        return WishlistModel.findOne({ userId }).populate({
            path: "items.product",
            select: { product_name: 1, images: 1, price: 1 },
        });
    }

    public async addItemToWishlist(userId: string, item: IWishlistItem) {
        const existingCart = await WishlistModel.findOne({ userId });
        if (!existingCart) {
            return await WishlistModel.create({ userId, items: [item] });
        }
        const existingItemIndex = existingCart.items.findIndex(
            (cartItem) => cartItem.product.toString() === item.product.toString(),
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
        item: IWishlistItem,
    ) {
        this.logger.logInfo(`Updating item in wishlist for user ${userId}`);
        return WishlistModel.findOneAndUpdate(
            { userId, "items.product": productId },
            { $set: { "items.$": item } },
            { new: true },
        );
    }

    public async removeItemFromWishlist(userId: string, productId: string) {
        this.logger.logInfo(
            `Removing item from wishlist for user ${userId} with product id ${productId}`,
        );
        return WishlistModel.findOneAndUpdate(
            { userId },
            { $pull: { items: { product: productId } } },
            { new: true },
        ).populate({
            path: "items.product",
            select: { product_name: 1, images: 1, price: 1 },
        });
    }
}
