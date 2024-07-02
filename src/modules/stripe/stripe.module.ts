import { Module } from '@nestjs/common';
import { StripeService } from './services/stripe.service';
import { StripeController } from './controllers/stripe.controller';

@Module({
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}
