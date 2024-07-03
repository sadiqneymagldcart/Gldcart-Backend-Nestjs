import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument, CartItem } from '@cart/schemas/cart.schema';
import { CartItemDto } from '@cart/dto/cart-item.dto';
import { ICartService } from '@cart/iterfaces/cart.service.interface';

@Injectable()
export class CartService implements ICartService {
  private readonly logger = new Logger(CartService.name);

  public constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
  ) {
    this.logger.log('CartService initialized');
  }

  public async findByUserId(userId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      this.logger.error(`No carts found for user with id ${userId}`);
      throw new NotFoundException(`No carts found for user with id ${userId}`);
    }
    this.logger.log(`Found a cart for user with id ${userId}`);
    return cart;
  }

  public async findOne(id: string): Promise<Cart> {
    this.logger.log(`Fetching cart with id ${id}`);
    const cart = await this.cartModel.findById(id);
    if (!cart) {
      this.logger.error(`Cart with ID ${id} not found`);
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    this.logger.log(`Found cart with id ${id}`);
    return cart;
  }

  public async addItem(userId: string, newItem: CartItemDto): Promise<Cart> {
    this.logger.log(`Adding item to cart for user ${userId}`);

    let cart = await this.cartModel.findOne({ user: userId });

    if (!cart) {
      cart = new this.cartModel({
        user: userId,
        items: [newItem],
      });
      this.logger.debug(`New cart created: ${JSON.stringify(cart)}`);
    } else {
      const itemIndex = cart.items.findIndex(
        (i) =>
          i.itemId.toString() === newItem.itemId &&
          i.itemType === newItem.itemType,
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += newItem.quantity;
        this.logger.debug(`Updated cart: ${JSON.stringify(cart)}`);
      } else {
        cart.items.push(newItem);
        this.logger.debug(`Added item to cart: ${JSON.stringify(cart)}`);
      }
    }
    return await cart.save();
  }

  public async removeItem(id: string, itemId: string): Promise<Cart> {
    this.logger.log(`Removing item from cart with id ${id}`);
    const existingCart = await this._checkCartExists(id);

    const itemIndex = existingCart.items.findIndex(
      (item: CartItem) => item.itemId === itemId,
    );

    if (itemIndex === -1) {
      this.logger.error(`Item with ID ${itemId} not found in cart`);
      throw new NotFoundException(`Item with ID ${itemId} not found in cart`);
    }

    existingCart.items.splice(itemIndex, 1);

    this.logger.debug(
      `Removed item from cart: ${JSON.stringify(existingCart)}`,
    );

    return existingCart.save();
  }

  public async updateItem(id: string, updateItem: CartItemDto): Promise<Cart> {
    this.logger.log(`Updating item in cart with id ${id}`);
    const existingCart = await this._checkCartExists(id);

    const itemIndex = existingCart.items.findIndex(
      (item: CartItem) =>
        item.itemId === updateItem.itemId &&
        item.itemType === updateItem.itemType,
    );

    if (itemIndex === -1) {
      this.logger.error(`Item with ID ${updateItem.itemId} not found in cart`);
      throw new NotFoundException(
        `Item with ID ${updateItem.itemId} not found in cart`,
      );
    }

    existingCart.items[itemIndex] = updateItem;

    return existingCart.save();
  }

  public async remove(id: string): Promise<void> {
    this.logger.log(`Removing cart with id ${id}`);
    const result = await this.cartModel.findByIdAndDelete(id);
    if (!result) {
      this.logger.error(`Cart with ID ${id} not found`);
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    this.logger.log(`Removed cart with id ${id}`);
  }

  private async _checkCartExists(id: string): Promise<CartDocument> {
    this.logger.log(`Checking if cart with id ${id} exists`);
    const cart = await this.cartModel.findById(id);
    if (!cart) {
      this.logger.error(`Cart with ID ${id} not found`);
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    this.logger.log(`Cart with id ${id} exists`);
    return cart;
  }
}
