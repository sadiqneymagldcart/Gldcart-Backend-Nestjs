import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StripeService } from '@stripe/services/stripe.service';

@Injectable()
export class SubscriptionService {
  public constructor(
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
  ) {}

  public async createMonthlySubscription(customerId: string) {
    const subscription = await this.getSubscription(customerId);

    if (subscription) {
      throw new BadRequestException('Customer already subscribed');
    }
    const price_id = this.configService.get('MONTHLY_SUBSCRIPTION_PRICE_ID');
    return this.stripeService.createSubscription(price_id, customerId);
  }

  public async getMonthlySubscription(customerId: string) {
    const subscription = await this.getSubscription(customerId);

    if (!subscription) {
      throw new NotFoundException('Customer not subscribed');
    }
    return subscription;
  }

  private async getSubscription(customerId: string) {
    const price_id = this.configService.get('MONTHLY_SUBSCRIPTION_PRICE_ID');
    const subscriptions = await this.stripeService.listSubscriptions(
      price_id,
      customerId,
    );

    return subscriptions.data.length ? subscriptions.data[0] : null;
  }
}
