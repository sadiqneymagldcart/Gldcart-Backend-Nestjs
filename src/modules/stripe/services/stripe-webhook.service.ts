import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OrderService } from '@order/services/order.service';
import {
  StripeEvent,
  StripeEventDocument,
} from '@stripe/schemas/stripe-event.schema';
import { UserService } from '@user/services/user.service';
import { Model } from 'mongoose';
import { OrderStatus } from '@order/enums/order-status.enum';
import Stripe from 'stripe';

@Injectable()
export class StripeWebhookService {
  public constructor(
    @InjectModel(StripeEvent.name)
    private eventModel: Model<StripeEventDocument>,
    private readonly userService: UserService,
    private readonly orderService: OrderService,
  ) { }

  public async createEvent(id: string): Promise<StripeEvent> {
    const event = new this.eventModel({ _id: id });

    try {
      await event.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('This event was already processed');
      }
    }

    return event;
  }
  public async processSubscriptionUpdate(event: Stripe.Event) {
    await this.createEvent(event.id);

    const data = event.data.object as Stripe.Subscription;

    const customerId: string = data.customer as string;
    const subscriptionStatus = data.status;

    await this.userService.updateMonthlySubscriptionStatus(
      customerId,
      subscriptionStatus,
    );
  }

  public async processPaymentSucceded(event: Stripe.Event) {
    await this.createEvent(event.id);

    const data = event.data.object as Stripe.PaymentIntent;

    const orderId = data.metadata.orderId;

    await this.orderService.updateOrderStatus(orderId, OrderStatus.READY);
    await this.orderService.updateInventory(orderId);
  }
}
