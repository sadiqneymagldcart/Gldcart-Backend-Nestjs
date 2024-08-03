import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { StripeError } from '@stripe/enums/stripe-error.enum';
import { Metadata } from '@stripe/interfaces/metadata.interface';

@Injectable()
export class StripeService {
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
    } catch (error) {
      this.logger.error(
        `Failed to create payment intent for customer ${customerId} with amount ${amount} ${currency}`,
        error,
      );
      throw error;
    }
  }

  public async createSubscription(priceId: string, customerId: string) {
    try {
      return await this.stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: priceId,
          },
        ],
      });
    } catch (error) {
      if (error?.code === StripeError.ResourceMissing) {
        throw new BadRequestException('Credit card not set up');
      }
      throw new InternalServerErrorException();
    }
  }

  public async attachCreditCard(paymentMethodId: string, customerId: string) {
    return this.stripe.setupIntents.create({
      customer: customerId,
      payment_method: paymentMethodId,
    });
  }

  public async listCreditCards(customerId: string) {
    return this.stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
  }

  public async listSubscriptions(priceId: string, customerId: string) {
    return this.stripe.subscriptions.list({
      customer: customerId,
      price: priceId,
      expand: ['data.latest_invoice', 'data.latest_invoice.payment_intent'],
    });
  }

  public async constructEventFromPayload(
    signature: string,
    payload: Buffer,
  ): Promise<Stripe.Event> {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');

    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  }
}
