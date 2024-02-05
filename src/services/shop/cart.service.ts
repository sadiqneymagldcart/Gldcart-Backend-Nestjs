import {Logger} from "../../utils/logger";
import {Cart, CartModel} from "../../models/shop/Cart";
import {ApiError} from "../../exceptions/api.error";
import {Product, ProductModel} from "../../models/shop/Product";
import {Types as MongooseTypes} from "mongoose";
import {inject, injectable} from "inversify";
import {BaseService} from "../base.service";

@injectable()
export class CartService extends BaseService {
    public constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }

    public async getCartItems(userId: string): Promise<Cart | ApiError> {
        try {
            if (!userId) {
                return ApiError.BadRequest("Invalid inputs");
            }
            const cartItems: Cart | null = await CartModel.findOne({user: userId});
            if (!cartItems) {
                this.logInfo(userId, "Cart not found for");
                return ApiError.BadRequest("Cart not found");
            }
            this.logInfo(userId, "Retrieved cart items successfully for");
            return cartItems;
        } catch (error: any) {
            return await this.handleApiError(
                userId,
                "Error while retrieving cart items for",
                error,
            );
        }
    }

    public async addCartItem(
        userId: string,
        productId: string,
        quantity: number,
    ): Promise<Cart | ApiError> {
        try {
            const product: Product | null = await ProductModel.findById(productId);
            if (!product || product.quantity < quantity) {
                return await this.handleApiError(
                    userId,
                    "Product not found or insufficient quantity for product",
                    {productId},
                );
            }
            let cart: Cart | null = await CartModel.findOneAndUpdate(
                { user: userId, "items.product": { $ne: productId } },
                {
                    $push: {
                        cartItems: {
                            product: new MongooseTypes.ObjectId(productId),
                            quantity: quantity,
                        },
                    },
                },
                { new: true },
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
                cart = await CartModel.create(newCart);
                this.logInfo(userId, "New cart created for");
            } else {
                this.logger.logInfo(
                    `Product added to the cart. ProductId: ${productId}, Quantity: ${quantity}`,
                );
            }
            return cart;
        } catch (error: any) {
            return await this.handleApiError(
                userId,
                "Error while adding cart item for",
                error,
            );
        }
    }

    public async removeItem(
        userId: string,
        productId: string,
    ): Promise<Cart | ApiError> {
        try {
            if (!userId || !productId) {
                return ApiError.BadRequest("Invalid inputs");
            }
            const cart = await CartModel.findOneAndUpdate(
                { user: userId },
                { $pull: { cartItems: { product: productId } } },
                { new: true },
            );
            if (!cart) {
                this.logInfo(userId, "Cart not found for");
                return ApiError.BadRequest("Cart not found");
            }
            this.logInfo(userId, "Product removed successfully from cart");
            return cart;
        } catch (error: any) {
            return await this.handleApiError(
                userId,
                "Error while removing product from cart",
                error,
            );
        }
    }

    public async updateCartItem(
        cartId: string,
        itemId: string,
        quantity: number,
    ) {
        // to be implemented
    }

    public async clearCart(cartId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    private async handleApiError(
        userId: string,
        errorMessage: string,
        error: any,
    ): Promise<ApiError> {
        this.logger.logError(
            `Error for User: ${userId}. Error: ${errorMessage}. Details: ${error.message}`,
        );
        return ApiError.BadRequest(errorMessage);
    }

    private logInfo(userId: string, message: string): void {
        this.logger.logInfo(`${message} User: ${userId}`);
    }
}
