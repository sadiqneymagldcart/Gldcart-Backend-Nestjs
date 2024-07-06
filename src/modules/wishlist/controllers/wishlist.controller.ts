import { Controller } from '@nestjs/common';
import { WishlistService } from '@wishlist/services/wishlist.service';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}
}
