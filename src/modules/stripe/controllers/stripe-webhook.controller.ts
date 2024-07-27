import {
  Controller,
  Post,
  Headers,
  Req,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { RequestWithRawBody } from '@stripe/interfaces/raw-body.interface';
import { StripeWebhookService } from '@stripe/services/stripe-webhook.service';
import { StripeService } from '@stripe/services/stripe.service';

@ApiTags('Stripe Webhook')
@Controller('webhook')
export class StripeWebhookController {
  private readonly logger = new Logger(StripeWebhookController.name);

  public constructor(
    private readonly stripeService: StripeService,
    private readonly stripeWebhookService: StripeWebhookService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Handle incoming Stripe events' })
  @ApiHeader({
    name: 'stripe-signature',
    description: 'Signature from Stripe to verify the request',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The event has been successfully processed.',
  })
  @ApiResponse({
    status: 400,
    description: 'Missing stripe-signature header',
  })
  public async handleIncomingEvents(
    @Headers('stripe-signature') signature: string,
    @Req() request: RequestWithRawBody,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    const event = await this.stripeService.constructEventFromPayload(
      signature,
      request.rawBody,
    );

    switch (event.type) {
      case 'customer.subscription.updated':
      case 'customer.subscription.created':
        this.logger.log(`Subscription updated for customer: ${event.id}`);
        return this.stripeWebhookService.processSubscriptionUpdate(event);
      case 'payment_intent.succeeded':
        this.logger.log(`Payment succeeded for payment intent: ${event.id}`);
        await this.stripeWebhookService.processPaymentSucceded(event);
      case 'payment_intent.payment_failed':
        this.logger.warn(`Payment failed for payment intent: ${event.id}`);
      default:
        this.logger.warn(`Unhandled event type: ${event.type}`);
    }
  }
}
