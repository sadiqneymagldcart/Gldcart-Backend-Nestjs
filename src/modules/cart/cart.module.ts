import { Module } from '@nestjs/common';
import { CartService } from './services/cart.service';
import { CartController } from './controllers/cart.controller';

@Module({
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
