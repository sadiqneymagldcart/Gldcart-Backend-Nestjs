import { ItemTypes } from '@item/enums/item-types.enum';
import { Item } from '@item/schemas/item.schema';
import { Injectable } from '@nestjs/common';
import { ProductService } from '@product/services/product.service';
import { ClientSession } from 'mongoose';

@Injectable()
export class InventoryService {
  public constructor(private readonly productService: ProductService) {}

  public async updateInventory(
    items: Item[],
    session?: ClientSession,
  ): Promise<void> {
    const productsToUpdate = items.filter(
      (item) => item.type === ItemTypes.PRODUCT,
    );
    await Promise.all(
      productsToUpdate.map((product) =>
        this.productService.updateStock(product.id, product.quantity, session),
      ),
    );
  }
}
