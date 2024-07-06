import { Module } from '@nestjs/common';
import { ItemService } from './services/item.service';
import { OfferingModule } from '@offering/offering.module';
import { ProductModule } from '@product/product.module';
import { RentingModule } from '@renting/renting.module';

@Module({
  imports: [ProductModule, RentingModule, OfferingModule],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
