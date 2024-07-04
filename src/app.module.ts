import { Module } from '@nestjs/common';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import { TokenModule } from '@token/token.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewModule } from '@review/review.module';
import { EmailModule } from '@email/email.module';
import { ProductModule } from '@product/product.module';
import { RentingModule } from '@renting/renting.module';
import { OfferingModule } from '@offering/offering.module';
import { CartModule } from '@cart/cart.module';
import { ChatModule } from '@chat/chat.module';
import { StripeModule } from '@stripe/stripe.module';
import { SubscriptionModule } from '@subscription/subscription.module';
import mongoDB from '@config/mongoDB';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: mongoDB,
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    TokenModule,
    OfferingModule,
    ProductModule,
    RentingModule,
    CartModule,
    ReviewModule,
    EmailModule,
    ChatModule,
    StripeModule,
    SubscriptionModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
