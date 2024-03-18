import { inject, injectable } from "inversify";
import { Logger } from "../../utils/logger";
import { Cart, CartItem, CartModel } from "../../models/shop/cart/Cart";
import { BaseService } from "../base/base.service";

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

    public async getCartByUserId(userId: string) {
        this.logger.logInfo(`Getting cart for user ${userId}`);
        return await CartModel.findOne({ userId }).populate("items.product");
    }

    public async getCartByUserIdAndProductId(userId: string, productId: string) {
        this.logger.logInfo(
            `Getting cart for user ${userId} with product id ${productId}`,
        );
        return await CartModel.findOne({ userId, "items.product": productId });
    }

    public async addItemToCart(userId: string, item: CartItem) {
        console.log("Adding item to cart", userId, item);
        const existingCart = await CartModel.findOne({ userId });
        if (!existingCart) {
            return await CartModel.create({ userId, items: [item] });
        }
        const existingItemIndex = existingCart.items.findIndex(
            (cartItem) => cartItem.product.toString() === item.product.toString(),
        );
        if (existingItemIndex !== -1) {
            existingCart.items[existingItemIndex].quantity += item.quantity;
            return await existingCart.save();
        }
        existingCart.items.push(item);
        return await existingCart.save();
    }

    public async updateCartItem(
        userId: string,
        productId: string,
        item: CartItem,
    ) {
        return await CartModel.findOneAndUpdate(
            { userId, "items.product": productId },
            { $set: { "items.$": item } },
            { new: true },
        );
    }
    public async removeItemFromCart(userId: string, productId: string) {
        this.logger.logInfo(`Removing item from cart for user ${userId}`);
        return await CartModel.findOneAndUpdate(
            { userId },
            { $pull: { items: { product: productId } } },
            { new: true },
        ).populate("items.product");
    }

    public async clearCart(userId: string) {
        return await CartModel.findOneAndUpdate(
            { userId },
            { items: [] },
            { new: true },
        );
    }

    public async getCartItemsWithTotalPrice(userId: string) {
        const cart = await CartModel.findOne({ userId }).populate("items.product");
        let subTotal = 0;
        cart.items.forEach((item) => {
            subTotal += item.product.price * item.quantity;
        });
        return { items: cart.items, subTotal: subTotal };
    }
}
