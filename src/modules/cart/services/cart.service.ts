import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from '../schemas/cart.schema';
import { CreateCartDto } from '../dto/create-cart.dto';
import { UpdateCartDto } from '../dto/update-cart.dto';

@Injectable()
export class CartService {
  public constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
  ) { }

  public async create(createCartDto: CreateCartDto): Promise<Cart> {
    const createdCart = new this.cartModel(createCartDto);
    return createdCart.save();
  }

  public async findAll(): Promise<Cart[]> {
    return this.cartModel.find().exec();
  }

  public async findOne(id: string): Promise<Cart> {
    const cart = await this.cartModel.findById(id).exec();
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return cart;
  }

  public async update(id: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    const existingCart = await this.cartModel
      .findByIdAndUpdate(id, updateCartDto, { new: true })
      .exec();
    if (!existingCart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return existingCart;
  }

  public async remove(id: string): Promise<void> {
    const result = await this.cartModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
  }
}
