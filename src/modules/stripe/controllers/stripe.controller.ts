import { Controller } from '@nestjs/common';
import { StripeService } from '@stripe/services/stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}
}
