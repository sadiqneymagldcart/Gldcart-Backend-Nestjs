import { Module } from '@nestjs/common';
import { SubscriptionService } from './services/subscription.service';
import { SubscriptionController } from './controllers/subscription.controller';
import { StripeService } from '@stripe/services/stripe.service';
import { TokenModule } from '@token/token.module';

@Module({
  imports: [TokenModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, StripeService],
})
export class SubscriptionModule {}
