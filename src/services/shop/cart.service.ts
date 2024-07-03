import { inject, injectable } from "inversify";
import { BaseService } from "../base.service";
import { Logger } from "../../utils/logger";
import { Cart, CartItem, CartModel } from "../../models/shop/cart/Cart";

@injectable()
export class CartService extends BaseService {
    public constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }

    public async createCart(cart: Cart) {
        this.logger.logInfo(`Creating cart for user ${cart.userId}`);
        return await CartModel.create(cart);
    }

    public async updateCart(userId: string, cart: Cart) {
        this.logger.logInfo(`Updating cart for user ${userId}`);
        return await CartModel.findOneAndUpdate({ userId }, cart, { new: true });
    }

    public async deleteCart(userId: string) {
        this.logger.logInfo(`Deleting cart for user ${userId}`);
        return await CartModel.findOneAndDelete({ userId });
    }

    public async getCartById(cartId: string) {
        this.logger.logInfo(`Getting cart with id ${cartId}`);
        return await CartModel.findById(cartId).populate("items.productId");
    }
    public async getCartByUserId(userId: string) {
        this.logger.logInfo(`Getting cart for user ${userId}`);
        return await CartModel.findOne({ userId }).populate("items.product");
    }
    public async getCartByUserIdAndProductId(userId: string, productId: string) {
        this.logger.logInfo(
            `Getting cart for user ${userId} with product id ${productId}`,
        );
        return await CartModel.findOne({ userId, "items.productId": productId });
    }
    public async addItemToCart(userId: string, item: CartItem) {
        this.logger;
        return await CartModel.findOneAndUpdate(
            { userId },
            { $push: { items: item } },
            { new: true, upsert: true },
        );
    }

    public async updateCartItem(
        userId: string,
        productId: string,
        item: CartItem,
    ) {
        return await CartModel.findOneAndUpdate(
            { userId, "items.productId": productId },
            { $set: { "items.$": item } },
            { new: true },
        );
    }
    public async removeItemFromCart(userId: string, productId: string) {
        return await CartModel.findOneAndUpdate(
            { userId },
            { $pull: { items: { productId } } },
            { new: true },
        );
    }

    public async clearCart(userId: string) {
        return await CartModel.findOneAndUpdate(
            { userId },
            { items: [] },
            { new: true },
        );
    }

    public async getCartItemsWithTotalPrice(userId: string) {
        const cart = await CartModel.findOne({ userId }).populate(
            "items.productId",
        );

        let totalPrice = 0;
        cart.items.forEach((item) => {
            totalPrice += item.productId.price * item.quantity;
        });
        return { items: cart.items, totalPrice };
    }

    public async addItemsToCartWithTotalPrice(userId: string, items: CartItem[]) {
        let totalPrice = 0;

        items.forEach((item) => {
            totalPrice += item.productId.price * item.quantity;
        });

        return await CartModel.findOneAndUpdate(
            { userId },
            { $push: { items }, totalPrice },
            { new: true, upsert: true },
        );
    }
}
