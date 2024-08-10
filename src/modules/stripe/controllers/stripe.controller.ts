import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthenticationGuard } from '@shared/guards/jwt.auth.guard';
import { PaymentIntentDto } from '@stripe/dto/payment-intent.dto';
import { StripeService } from '@stripe/services/stripe.service';

@ApiTags('Stripe')
@ApiBearerAuth()
@UseGuards(JwtAuthenticationGuard)
@Controller('stripe')
export class StripeController {
  private readonly logger = new Logger(StripeController.name);

  public constructor(private readonly stripeService: StripeService) {}

  @Post('payment-intent')
  @ApiOperation({ summary: 'Create a new payment intent' })
  @ApiBody({ type: PaymentIntentDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Payment intent successfully created.',
  })
  public async createPaymentIntent(
    @Body() intent: PaymentIntentDto,
    @Req() request: Request & { user: { stripe_cus_id: string } },
  ) {
    this.logger.debug(
      `Creating payment intent for user ${JSON.stringify(request.user)} and metadata ${JSON.stringify(intent.metadata)}`,
    );
    const payment_intent = await this.stripeService.createPaymentIntent(
      intent.amount,
      intent.metadata,
      request.user.stripe_cus_id,
    );
    return { client_secret: payment_intent.client_secret };
  }
}
