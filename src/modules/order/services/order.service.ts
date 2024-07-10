import { ItemTypes } from '@item/enums/item-types.enum';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrderDto } from '@order/dto/create-order.dto';
import { OrderStatus } from '@order/enums/order-status.enum';
import { Order, OrderDocument } from '@order/schemas/order.schema';
import { ProductService } from '@product/services/product.service';
import { Model, ClientSession } from 'mongoose';

@Injectable()
export class OrderService {
  public constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly productService: ProductService,
  ) {}

  public async createOrder(order: CreateOrderDto): Promise<Order> {
    return await this.orderModel.create(order);
  }

  public async findOrderWithItemsById(id: string) {
    const order = await this.orderModel
      .findById(id)
      .populate('items.id')
      .lean();
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);

    return order;
  }

  public async processPaymentAndInventory(
    orderId: string,
    status: OrderStatus,
  ) {
    const session = await this.orderModel.db.startSession();
    session.startTransaction();
    try {
      const order = await this.updateOrder(orderId, { status }, session);

      if (!order) throw new NotFoundException();

      await this.updateInventory(order, session);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  private async updateOrder(
    id: string,
    data: Partial<OrderDocument>,
    session: ClientSession,
  ): Promise<Order> {
    const order = await this.orderModel.findOneAndUpdate({ _id: id }, data, {
      new: true,
      session,
    });
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);

    return order;
  }

  private async updateInventory(
    order: Order,
    session: ClientSession,
  ): Promise<void> {
    const productsToUpdate = order.items.filter(
      (item) => item.type === ItemTypes.PRODUCT,
    );
    await Promise.all(
      productsToUpdate.map((product) =>
        this.productService.updateStock(product.id, product.quantity, session),
      ),
    );
  }
}
