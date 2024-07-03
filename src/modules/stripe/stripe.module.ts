import { Module } from '@nestjs/common';
import { StripeController } from './controllers/stripe.controller';
import StripeService from './services/stripe.service';
import { TokenModule } from '@token/token.module';

@Module({
  imports: [TokenModule],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule { }
