import { ItemTypes } from '@item/enums/item-types.enum';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { OfferingService } from '@offering/services/offering.service';
import { ProductService } from '@product/services/product.service';
import { RentingService } from '@renting/services/renting.service';

@Injectable()
export class ItemService {
  private readonly logger = new Logger(ItemService.name);

  public constructor(
    private productService: ProductService,
    private offeringService: OfferingService,
    private rentingService: RentingService,
  ) {}

  private getServiceByType(type: ItemTypes) {
    switch (type) {
      case ItemTypes.PRODUCT:
        return this.productService;
      case ItemTypes.OFFERING:
        return this.offeringService;
      case ItemTypes.RENTING:
        return this.rentingService;
      default:
        throw new Error(`Unsupported item type: ${type}`);
    }
  }

  public async updateStock(itemId: string, quantity: number) {
    this.logger.log(`Updating stock for item ${itemId}`);
    try {
      const updatedItem = await this.productService.updateStock(
        itemId,
        quantity,
      );
      if (!updatedItem) {
        this.logger.error(`Insufficient stock for item ${itemId}`);
        throw new BadRequestException(`Insufficient stock for item ${itemId}`);
      }
      this.logger.log(`Stock for item ${itemId} updated successfully`);
      return updatedItem;
    } catch (error) {
      this.logger.error(
        `Failed to update stock for item ${itemId}: ${error.message}`,
      );
      throw error;
    }
  }

  public async populateItems(items: { type: ItemTypes; _id: string }[]) {
    const promises = items.map(async ({ type, _id: id }) => {
      try {
        const service = this.getServiceByType(type);
        const populatedItem = await service.findById(id);
        if (!populatedItem) {
          throw new NotFoundException(`Item with ID ${id} not found`);
        }
        return populatedItem;
      } catch (error) {
        this.logger.error(
          `Failed to populate item with ID ${id}: ${error.message}`,
        );
        throw error;
      }
    });

    const results = await Promise.allSettled(promises);
    const populatedItems = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => (result as PromiseFulfilledResult<any>).value);

    return populatedItems;
  }
}
