import { Module } from '@nestjs/common';
import { StripeController } from './controllers/stripe.controller';
import { TokenModule } from '@token/token.module';
import { StripeService } from './services/stripe.service';

@Module({
  imports: [TokenModule],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule { }
