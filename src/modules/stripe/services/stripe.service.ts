import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Metadata } from '@stripe/interfaces/metadata.interface';
import Stripe from 'stripe';

@Injectable()
export default class StripeService {
  private stripe: Stripe;

  private readonly logger = new Logger(StripeService.name);

  public constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY')!, {
      apiVersion: this.configService.get('STRIPE_API_VERSION'),
    });
  }

  public async createCustomer(name: string, email: string) {
    return this.stripe.customers.create({
      name,
      email,
    });
  }

  public async createPaymentIntent(
    amount: number,
    currency: string,
    metadata: Metadata,
    customerId: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        customer: customerId,
        currency,
        metadata,
        confirm: false,
      });
      this.logger.log(`Payment intent created: ${paymentIntent.id}`);
      return paymentIntent;
    } catch (error: any) {
      this.logger.error(
        `Failed to create payment intent for customer ${customerId} with amount ${amount} ${currency}`,
        error,
      );
      throw error;
    }
  }
}
