import { ItemService } from '@item/services/item.service';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from '@order/schemas/order.schema';
import { Nullable } from '@shared/types/common';
import { Model } from 'mongoose';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  public constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly itemService: ItemService,
  ) { }

  public async create(order: Order): Promise<Order> {
    this.logger.log('Creating order');
    const createdOrder = new this.orderModel(order);
    return createdOrder.save();
  }

  public async getByIdWithPopulatedItems(id: string): Promise<Nullable<Order>> {
    this.logger.log(`Retrieving order with populated items: ${id}`);
    const order = await this.orderModel.findById(id);

    if (!order) {
      this.logger.error(`Order not found: ${id}`);
      return null;
    }

    // const populatedItems = await this.itemService.populateItems(order.items);

    // return { ...order.toJSON(), items: populatedItems };
  }
}
