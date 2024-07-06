import { Module } from '@nestjs/common';
import { WishlistController } from './controllers/wishlist.controller';
import { WishlistService } from './services/wishlist.service';

@Module({
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
