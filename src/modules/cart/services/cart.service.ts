import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from '@cart/schemas/cart.schema';
import { CreateItemDto } from '@item/dto/create-item.dto';
import { ICartService } from '@cart/iterfaces/cart.service.interface';
import { UpdateItemDto } from '@item/dto/update-item.dto';

@Injectable()
export class CartService implements ICartService {
  public constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
  ) {}

  public async getCartByUserId(user_id: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ customer: user_id });
    if (!cart) {
      throw new NotFoundException(`No carts found for user with id ${user_id}`);
    }
    return cart;
  }

  public async getCartById(id: string): Promise<Cart> {
    const cart = await this.cartModel.findById(id);
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return cart;
  }

  public async findCartWithItemsById(id: string): Promise<Cart> {
    const cart = await this.cartModel.findById(id).populate('items.id');
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return cart;
  }

  public async addItemToCart(
    user_id: string,
    newItem: CreateItemDto,
  ): Promise<Cart> {
    const existingCart = await this.cartModel.findOne({ customer: user_id });

    if (!existingCart) {
      const cart = new this.cartModel({
        customer: user_id,
        items: [newItem],
      });
      return cart.save();
    } else {
      const itemExists = existingCart.items.some(
        (item) => item.id.toString() === newItem.id,
      );

      if (!itemExists) {
        existingCart.items.push(newItem);
      }
      return existingCart.save();
    }
  }

  public async removeItemFromCart(id: string, itemId: string): Promise<Cart> {
    const existingCart = await this.getCartByIdOrThrow(id);

    const itemIndex = existingCart.items.findIndex(
      (item) => item.id === itemId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException(`Item with ID ${id} not found in cart`);
    }

    existingCart.items.splice(itemIndex, 1);

    return existingCart.save();
  }

  public async updateItemInCart(
    id: string,
    updateItem: CreateItemDto,
  ): Promise<Cart> {
    const existingCart = await this.getCartByIdOrThrow(id);

    const itemIndex = existingCart.items.findIndex(
      (item) => item.id === updateItem.id,
    );

    if (itemIndex === -1) {
      throw new NotFoundException(
        `Item with ID ${updateItem.id} not found in cart`,
      );
    }

    existingCart.items[itemIndex] = updateItem;

    return existingCart.save();
  }

  public async updateItemQuantityInCart(
    id: string,
    itemId: string,
    updateItem: UpdateItemDto,
  ): Promise<Cart> {
    const existingCart = await this.getCartByIdOrThrow(id);

    const item = existingCart.items.find((i) => i.id.toString() === itemId);

    if (!item) {
      throw new NotFoundException(`Item with ID ${itemId} not found in cart`);
    }

    item.quantity = updateItem.quantity;

    return existingCart.save();
  }

  public async removeCartById(id: string): Promise<{ message: string }> {
    const result = await this.cartModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return { message: 'Cart deleted successfully' };
  }

  private async getCartByIdOrThrow(id: string): Promise<CartDocument> {
    const cart = await this.cartModel.findById(id);
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return cart;
  }
}
