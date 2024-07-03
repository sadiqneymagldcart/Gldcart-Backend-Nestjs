import { Module } from '@nestjs/common';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import { TokenModule } from '@token/token.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import token from '@config/token';
import mongoDB from '@config/mongoDB';
import { OfferingModule } from './modules/offering/offering.module';
import { CartModule } from './modules/cart/cart.module';
import { ReviewModule } from '@review/review.module';
import { EmailModule } from '@email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
      load: [token],
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
    CartModule,
    ReviewModule,
    EmailModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
