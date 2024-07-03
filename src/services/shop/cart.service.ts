import {Logger} from "../../utils/logger";
import {Cart, ICart} from "../../models/Cart";
import {ApiError} from "../../exceptions/api.error";
import Product, {IProduct} from "../../models/Product";
import {Types as MongooseTypes} from "mongoose";
import {inject, injectable} from "inversify";
import {BaseService} from "../base.service";

@injectable()
export class CartService extends BaseService {
    constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }

    async getCartItems(userId: string): Promise<ICart | ApiError> {
        try {
            if (!userId) {
                return ApiError.BadRequest("Invalid inputs");
            }
            const cartItems: ICart | null = await Cart.findOne({user: userId});
            if (!cartItems) {
                await this.logger.logInfo(`Cart not found for User: ${userId}`);
                return ApiError.BadRequest("Cart not found");
            }
            await this.logger.logInfo(
                `Retrieved cart items successfully for User: ${userId}`,
            );
            return cartItems;
        } catch (error: any) {
            await this.logger.logError(
                `Error while retrieving cart items for User: ${userId}. Error: ${error.message}`,
            );
            return ApiError.BadRequest(error.message);
        }
    }

    async addCartItem(
        userId: string,
        productId: string,
        quantity: number,
    ): Promise<ICart | ApiError> {
        try {
            const product: IProduct | null = await Product.findById(productId);
            if (!product || product.quantity < quantity) {
                await this.logger.logError(
                    `Product not found or insufficient quantity for productId: ${productId}`,
                );
                return ApiError.BadRequest(
                    "Product not found or insufficient quantity",
                );
            }
            let cart: ICart | null = await Cart.findOneAndUpdate(
                {user: userId, "items.product": {$ne: productId}},
                {
                    $push: {
                        items: {
                            product: new MongooseTypes.ObjectId(productId),
                            quantity: quantity,
                        },
                    },
                },
                {new: true},
            );
            if (!cart) {
                let newCart = {
                    user: userId,
                    items: [
                        {
                            product: new MongooseTypes.ObjectId(productId),
                            quantity: quantity,
                        },
                    ],
                };
                cart = await Cart.create(newCart);
                await this.logger.logInfo(`New cart created for User: ${userId}`);
            } else {
                await this.logger.logInfo(
                    `Product added to the cart. ProductId: ${productId}, Quantity: ${quantity}`,
                );
            }
            return cart;
        } catch (error: any) {
            await this.logger.logError(
                `Error while adding cart item for User: ${userId}. Error: ${error.message}`,
            );
            return ApiError.BadRequest(error.message);
        }
    }

    async removeItem(
        userId: string,
        productId: string,
    ): Promise<ICart | ApiError> {
        try {
            if (!userId || !productId) {
                return ApiError.BadRequest("Invalid inputs");
            }
            const cart = await Cart.findOneAndUpdate(
                {user: userId},
                {$pull: {items: {product: productId}}},
                {new: true},
            );
            if (!cart) {
                await this.logger.logInfo(`Cart not found for User: ${userId}`);
                return ApiError.BadRequest("Cart not found");
            }
            await this.logger.logInfo(
                `Product removed successfully from User: ${userId}'s cart`,
            );
            return cart;
        } catch (error: any) {
            await this.logger.logError(
                `Error while removing product from User: ${userId}'s cart. Error: ${error.message}`,
            );
            return ApiError.BadRequest(error.message);
        }
    }
}
