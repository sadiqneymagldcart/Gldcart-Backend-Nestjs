import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StripePaymentService } from '@stripe/services/stripe-payment.service';

@Injectable()
export class StripeSubscriptionService {
  public constructor(
    private readonly stripeService: StripePaymentService,
    private readonly configService: ConfigService,
  ) {}

  public async createMonthlySubscription(customerId: string) {
    const subscription = await this.getSubscription(customerId);

    if (subscription) {
      throw new BadRequestException('Customer already subscribed');
    }
    const priceId = this.configService.get('MONTHLY_SUBSCRIPTION_priceId');
    return this.stripeService.createSubscription(priceId, customerId);
  }

  public async getMonthlySubscription(customerId: string) {
    const subscription = await this.getSubscription(customerId);

    if (!subscription) {
      throw new NotFoundException('Customer not subscribed');
    }
    return subscription;
  }

  private async getSubscription(customerId: string) {
    const priceId = this.configService.get('MONTHLY_SUBSCRIPTION_priceId');
    const subscriptions = await this.stripeService.listSubscriptions(
      priceId,
      customerId,
    );

    return subscriptions.data.length ? subscriptions.data[0] : null;
  }
}
