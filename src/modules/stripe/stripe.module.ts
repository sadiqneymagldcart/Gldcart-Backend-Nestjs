import { Module } from '@nestjs/common';
import { StripeController } from './controllers/stripe.controller';
import { TokenModule } from '@token/token.module';
import { StripeService } from './services/stripe.service';
import { StripeWebhookService } from './services/stripe-webhook.service';
import { StripeWebhookController } from './controllers/stripe-webhook.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeEvent, StripeEventSchema } from './schemas/stripe-event.schema';
import { UserModule } from '@user/user.module';

@Module({
  imports: [
    TokenModule,
    MongooseModule.forFeature([
      { name: StripeEvent.name, schema: StripeEventSchema },
    ]),
    UserModule,
  ],
  controllers: [StripeController, StripeWebhookController],
  providers: [StripeService, StripeWebhookService],
})
export class StripeModule { }
