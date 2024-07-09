import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrderDto } from '@order/dto/create-order.dto';
import { UpdateOrderDto } from '@order/dto/update-order.dto';
import { Order, OrderDocument } from '@order/schemas/order.schema';
import { Model } from 'mongoose';

@Injectable()
export class OrderService {
  public constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) { }

  public async createOrder(order: CreateOrderDto): Promise<Order> {
    return new this.orderModel(order).save();
  }

  public async findOrderWithItemsById(id: string): Promise<Order> {
    const cart = await this.orderModel
      .findById(id)
      .populate('items.id')
      .select('');
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return cart;
  }

  public async updateOrder(
    id: string,
    data: UpdateOrderDto,
  ): Promise<Order | null> {
    return this.orderModel.findByIdAndUpdate(id, data, { new: true });
  }
}
