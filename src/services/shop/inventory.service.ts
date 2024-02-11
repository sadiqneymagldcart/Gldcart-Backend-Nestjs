import {inject, injectable} from "inversify";
import {BaseService} from "../base.service";
import {Logger} from "../../utils/logger";
import {Inventory, InventoryModel} from "../../models/shop/test/Inventory";

@injectable()
export class InventoryService extends BaseService {
  public constructor(@inject(Logger) logger: Logger) {
    super(logger);
  }

  public async updateInventory(
      product_id: string,
      quantity: number,
  ): Promise<Inventory> {
    try {
      const inventory = await InventoryModel.findOne({product_id});
      if (inventory) {
        inventory.quantity = quantity;
        return await inventory.save();
      } else {
        return await InventoryModel.create({product_id, quantity});
      }
    } catch (error) {
      this.logger.logError(error);
      throw error;
    }
  }

  public async isProductInStock(product_id: string, quantity: number) {
    try {
      const inventory = await InventoryModel.findOne({product_id});
      if (inventory) {
        return inventory.quantity >= quantity;
      } else {
        return false;
      }
    } catch (error) {
      this.logger.logError(error);
      throw error;
    }
  }
}
