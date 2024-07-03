import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthenticationGuard } from '@shared/guards/jwt.auth.guard';
import { PaymentIntentDto } from '@stripe/dto/payment-intent.dto';
import StripeService from '@stripe/services/stripe.service';

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  public constructor(private readonly stripeService: StripeService) { }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Create a new payment intent' })
  @ApiResponse({
    status: 201,
    description: 'Payment intent successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: PaymentIntentDto })
  public async createPaymentIntent(
    @Body() intent: PaymentIntentDto,
    @Req() request: Request & { user: { stripeCustomerId: string } },
  ) {
    const paymentIntent = await this.stripeService.createPaymentIntent(
      intent.amount,
      intent.currency,
      { order_id: intent.orderId },
      request.user.stripeCustomerId,
    );

    return { client_secret: paymentIntent.client_secret };
  }
}
