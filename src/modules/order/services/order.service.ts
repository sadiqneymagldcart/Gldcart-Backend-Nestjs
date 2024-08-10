import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { EmailService } from '@email/services/email.service';
import { InventoryService } from '@inventory/services/inventory.service';
import { CreateOrderDto } from '@order/dto/create-order.dto';
import { OrderStatus } from '@order/enums/order-status.enum';
import { Order, OrderDocument } from '@order/schemas/order.schema';
import { StripeService } from '@stripe/services/stripe.service';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  public constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly inventoryService: InventoryService,
    private readonly emailService: EmailService,
    private readonly stripeService: StripeService,
  ) {}

  public async placeOrder(order: CreateOrderDto, stripeCustomerId: string) {
    const newOrder = await this.createOrder(order);

    this.logger.log(`Creating payment intent for order ${newOrder._id}`);

    const paymentIntent = await this.stripeService.createPaymentIntent(
      order.amount,
      { order_id: newOrder._id.toString() },
      stripeCustomerId,
    );

    return { client_secret: paymentIntent.client_secret };
  }

  public async createOrder(order: CreateOrderDto): Promise<OrderDocument> {
    const newOrder = new this.orderModel(order);
    return newOrder.save();
  }

  public async getWithItemsById(orderId: string): Promise<Order> {
    const order = await this.orderModel
      .findById(orderId)
      .populate('items.id')
      .lean();

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return order;
  }

  public async process(orderId: string, status: OrderStatus): Promise<void> {
    const session = await this.orderModel.db.startSession();
    session.startTransaction();
    try {
      const order = await this.update(orderId, { status }, session);

      await this.inventoryService.updateInventory(order.items, session);

      await session.commitTransaction();

      await this.emailService.sendOrderConfirmationEmail(order);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  private async update(
    orderId: string,
    data: Partial<OrderDocument>,
    session: ClientSession,
  ): Promise<Order> {
    const order = await this.orderModel.findOneAndUpdate(
      { _id: orderId },
      data,
      {
        new: true,
        session,
      },
    );
    if (!order)
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    return order;
  }
}
