import { Module } from '@nestjs/common';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import { TokenModule } from '@token/token.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import token from '@config/token';
import mongoDB from '@config/mongoDB';

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
  ],
  controllers: [AppController],
})
export class AppModule { }
