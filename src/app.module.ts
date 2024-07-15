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
import { ItemModule } from '@item/item.module';
import { CacheModule } from '@nestjs/cache-manager';
import { WishlistModule } from '@wishlist/wishlist.module';
import { AddressModule } from '@address/address.module';
import mongoConfig from '@config/mongo.config';
import * as redisStore from 'cache-manager-redis-store';
import redisConfig from '@config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: mongoConfig,
      inject: [ConfigService],
    }),
    CacheModule.register({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        ...redisConfig(configService),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AddressModule,
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
    ItemModule,
    WishlistModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
