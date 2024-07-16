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

  public async getByUserId(user_id: string): Promise<Cart> {
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

  public async getWithItemsById(id: string): Promise<Cart> {
    const cart = await this.cartModel.findById(id).populate('items.id');
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return cart;
  }

  public async addItem(user_id: string, newItem: CreateItemDto): Promise<Cart> {
    const existingCart = await this.cartModel.findOne({ customer: user_id });

    if (!existingCart) {
      return this.createCartWithItem(user_id, newItem);
    } else {
      return this.addItemToExistingCart(existingCart, newItem);
    }
  }

  public async removeItem(id: string, item_id: string): Promise<Cart> {
    const existingCart = await this.getByIdOrThrow(id);

    const itemIndex = existingCart.items.findIndex(
      (item) => item.id === item_id,
    );

    if (itemIndex === -1) {
      throw new NotFoundException(`Item with ID ${id} not found in cart`);
    }

    existingCart.items.splice(itemIndex, 1);

    return existingCart.save();
  }

  public async updateItem(
    id: string,
    updateItem: CreateItemDto,
  ): Promise<Cart> {
    const existingCart = await this.getByIdOrThrow(id);

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

  public async updateItemQuantity(
    id: string,
    item_id: string,
    updateItem: UpdateItemDto,
  ): Promise<Cart> {
    const existingCart = await this.getByIdOrThrow(id);

    const item = existingCart.items.find((i) => i.id.toString() === item_id);

    if (!item) {
      throw new NotFoundException(`Item with ID ${item_id} not found in cart`);
    }

    item.quantity = updateItem.quantity;

    return existingCart.save();
  }

  public async remove(id: string): Promise<{ message: string }> {
    const result = await this.cartModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return { message: 'Cart deleted successfully' };
  }

  private async getByIdOrThrow(id: string): Promise<CartDocument> {
    const cart = await this.cartModel.findById(id);
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return cart;
  }

  private createCartWithItem(
    user_id: string,
    newItem: CreateItemDto,
  ): Promise<Cart> {
    const cart = new this.cartModel({
      customer: user_id,
      items: [newItem],
    });
    return cart.save();
  }

  private addItemToExistingCart(
    existingCart: CartDocument,
    newItem: CreateItemDto,
  ): Promise<Cart> {
    const itemExists = existingCart.items.some(
      (item) => item.id.toString() === newItem.id,
    );
    if (!itemExists) {
      existingCart.items.push(newItem);
    }
    return existingCart.save();
  }
}
