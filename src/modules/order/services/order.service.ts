import { ItemTypes } from '@item/enums/item-types.enum';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrderDto } from '@order/dto/create-order.dto';
import { UpdateOrderDto } from '@order/dto/update-order.dto';
import { OrderStatus } from '@order/enums/order-status.enum';
import { Order, OrderDocument } from '@order/schemas/order.schema';
import { ProductService } from '@product/services/product.service';
import { Model } from 'mongoose';

@Injectable()
export class OrderService {
  public constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly productService: ProductService,
  ) { }

  public async createOrder(order: CreateOrderDto): Promise<Order> {
    return this.orderModel.findOneAndUpdate({}, order, {
      upsert: true,
      new: true,
    });
  }

  public async findOrderWithItemsById(id: string): Promise<Order> {
    const cart = await this.orderModel.findById(id).populate('items.id').lean();
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return cart;
  }

  public async updateOrder(
    id: string,
    data: UpdateOrderDto,
  ): Promise<Order | null> {
    return this.orderModel.findOneAndUpdate({ _id: id }, data, { new: true });
  }

  public async processPayment(
    orderId: string,
    status: OrderStatus,
  ): Promise<void> {
    await this.updateOrderStatus(orderId, status);
    await this.updateInventory(orderId);
  }

  public async updateOrderStatus(
    id: string,
    status: OrderStatus,
  ): Promise<Order> {
    const order = await this.orderModel.findOneAndUpdate(
      { _id: id },
      { status },
      { new: true },
    );
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  public async updateInventory(orderId: string): Promise<void> {
    const order = await this.findOrderWithItemsById(orderId);

    const productsToUpdate = order.items.filter(
      (item) => item.type === ItemTypes.PRODUCT,
    );

    await Promise.all(
      productsToUpdate.map((product) =>
        this.productService.updateStock(product.id, product.quantity),
      ),
    );

    return;
  }
}
