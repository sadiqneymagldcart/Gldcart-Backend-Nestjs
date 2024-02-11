import { inject, injectable } from "inversify";
import { Logger } from "../../utils/logger";
import { BaseService } from "../base.service";
import UserModel from "../../models/user/User";

@injectable()
export class WishlistService extends BaseService {
    public constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }

    public async getWishlist(userId: string) {
        const user = await UserModel.findById(userId);
        if (user) {
            return user.wishlist;
        }
    }

    public async addProductToWishlist(
        userId: string,
        productId: string,
    ) {
        const user = await UserModel.findById(userId);
        if (user) {
            user.wishlist.push(productId);
            await user.save();
            this.logger.logInfo("Added product to wishlist:", user);
        }
    }

    public async updateWishlist(
        userId: string,
        wishlist: string[],
    ) {
        const user = await UserModel.findById(userId);
        if (user) {
            user.wishlist = wishlist;
            await user.save();
            this.logger.logInfo("Updated wishlist:", user);
        }
    }

    public async removeProductFromWishlist(
        userId: string,
        productId: string,
    ) {
        const user = await UserModel.findById(userId);
        if (user) {
            user.wishlist = user.wishlist.filter((id) => id !== productId);
            await user.save();
            this.logger.logInfo("Removed product from wishlist:", user);
        }
    }
}
