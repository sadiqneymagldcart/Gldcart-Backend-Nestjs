import { inject, injectable } from "inversify";
import { Logger } from "@utils/logger";
import { ICart, ICartItem, CartModel } from "@models/shop/cart/Cart";
import { BaseService } from "../base/base.service";
import { BadRequestException } from "@exceptions/bad-request.exception";

@injectable()
export class CartService extends BaseService {
  public constructor(@inject(Logger) logger: Logger) {
    super(logger);
  }

  public async createCart(cart: ICart) {
    this.logger.logInfo(`Creating cart for user ${cart.userId}`);
    return await CartModel.create(cart);
  }

  public async deleteCart(userId: string) {
    this.logger.logInfo(`Deleting cart for user ${userId}`);
    return CartModel.findOneAndDelete({ userId });
  }

  public async addItemToCart(userId: string, item: ICartItem) {
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
    item: ICartItem,
  ) {
    return CartModel.findOneAndUpdate(
      { userId, "items.product": productId },
      { $set: { "items.$": item } },
      { new: true },
    );
  }

  public async removeItemFromCart(userId: string, productId: string) {
    this.logger.logInfo(`Removing item from cart for user ${userId}`);
    return CartModel.findOneAndUpdate(
      { userId },
      { $pull: { items: { product: productId } } },
      { new: true },
    ).populate("items.product");
  }

  public async getCartItems(userId: string) {
    const cart = await CartModel.findOne<ICart>({ userId }).populate({
      path: "items.product",
      select: "title product_name price",
    });

    if (!cart) {
      throw new BadRequestException("Cart does not exist");
    }

    const subtotal = this.getCartTotalAmount(cart);

    return { items: cart?.items, subtotal };
  }

  public async updateItemQuantity(userId: string, item: ICartItem) {
    const existingCart = await CartModel.findOne({ userId }).populate({
      path: "items.product",
      select: "title product_name price",
    });

    if (!existingCart || !existingCart.items || !existingCart.items.length) {
      throw new BadRequestException("Cart does not exist");
    }

    const existingItemIndex = existingCart.items.findIndex(
      (cartItem: ICartItem) =>
        cartItem._id?.toString() === item._id?.toString(),
    );
    // TODO: throw error if existingItem does not exist
    if (existingItemIndex === -1) {
      throw new BadRequestException("Item does not exist in cart");
    }
    console.log("Updating item quantity: ---------", existingCart.items, item);
    existingCart.items[existingItemIndex].quantity = item.quantity;
    const cart: ICart = await existingCart.save();

    return { cart, subtotal: this.getCartTotalAmount(cart) };
  }

  private getCartTotalAmount(cart: ICart): number {
    let subtotal = 0;

    cart?.items.forEach((item) => {
      subtotal += item.product.price * item.quantity;
    });

    return subtotal;
  }
}
