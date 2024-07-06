import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from '@cart/schemas/cart.schema';
import { ItemDto } from '@item/dto/item.dto';
import { ICartService } from '@cart/iterfaces/cart.service.interface';
import { Item } from '@item/schemas/item.schema';

@Injectable()
export class CartService implements ICartService {
  private readonly logger = new Logger(CartService.name);

  public constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
  ) {}

  public async findCartByUserId(userId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ customer: userId });
    if (!cart) {
      this.logger.error(`No carts found for user with id ${userId}`);
      throw new NotFoundException(`No carts found for user with id ${userId}`);
    }
    this.logger.log(`Found a cart for user with id ${userId}`);
    return cart;
  }

  public async findCartById(id: string): Promise<Cart> {
    this.logger.log(`Fetching cart with id ${id}`);
    const cart = await this.cartModel.findById(id);
    if (!cart) {
      this.logger.error(`Cart with ID ${id} not found`);
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    this.logger.log(`Found cart with id ${id}`);
    return cart;
  }

  public async findCartWithItemsById(id: string): Promise<Cart> {
    this.logger.log(`Fetching cart with items with id ${id}`);

    const cart = await this.cartModel.findById(id).populate('items.id').exec();

    if (!cart) {
      this.logger.error(`Cart with ID ${id} not found`);
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }

    return cart;
  }

  public async addItemToCart(userId: string, newItem: ItemDto): Promise<Cart> {
    this.logger.log(`Adding item to cart for user ${userId}`);

    let cart = await this.cartModel.findOne({ customer: userId });

    if (!cart) {
      cart = new this.cartModel({
        customer: userId,
        items: [newItem],
      });
      this.logger.debug(`New cart created: ${JSON.stringify(cart)}`);
    } else {
      const itemIndex = cart.items.findIndex(
        (i) => i.id.toString() === newItem.id && i.type === newItem.type,
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

  public async removeItemFromCart(id: string, itemId: string): Promise<Cart> {
    this.logger.log(`Removing item from cart with id ${id}`);
    const existingCart = await this._checkIfCartExists(id);

    const itemIndex = existingCart.items.findIndex(
      (item: Item) => item.id === itemId,
    );

    if (itemIndex === -1) {
      this.logger.error(`Item with ID ${id} not found in cart`);
      throw new NotFoundException(`Item with ID ${id} not found in cart`);
    }

    existingCart.items.splice(itemIndex, 1);

    this.logger.debug(
      `Removed item from cart: ${JSON.stringify(existingCart)}`,
    );

    return existingCart.save();
  }

  public async updateItemInCart(id: string, updateItem: ItemDto): Promise<Cart> {
    this.logger.log(`Updating item in cart with id ${id}`);
    const existingCart = await this._checkIfCartExists(id);

    const itemIndex = existingCart.items.findIndex(
      (item: Item) =>
        item.id === updateItem.id && item.type === updateItem.type,
    );

    if (itemIndex === -1) {
      this.logger.error(`Item with ID ${updateItem.id} not found in cart`);
      throw new NotFoundException(
        `Item with ID ${updateItem.id} not found in cart`,
      );
    }

    existingCart.items[itemIndex] = updateItem;

    return existingCart.save();
  }

  public async removeCartById(id: string): Promise<void> {
    this.logger.log(`Removing cart with id ${id}`);
    const result = await this.cartModel.findByIdAndDelete(id);
    if (!result) {
      this.logger.error(`Cart with ID ${id} not found`);
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    this.logger.log(`Removed cart with id ${id}`);
  }

  private async _checkIfCartExists(id: string): Promise<CartDocument> {
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
