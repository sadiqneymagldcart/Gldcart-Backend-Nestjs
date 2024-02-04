import { inject, injectable } from "inversify";
import { BaseService } from "../base.service";
import { Logger } from "../../utils/logger";
import { IInventory, Inventory } from "../../models/shop/Inventory";

@injectable()
export class InventoryService extends BaseService {
    constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }
    public async updateInventory(
        product_id: string,
        quantity: number,
    ): Promise<IInventory> {
        try {
            const inventory = await Inventory.findOne({ product_id });
            if (inventory) {
                inventory.quantity = quantity;
                return await inventory.save();
            } else {
                return await Inventory.create({ product_id, quantity });
            }
        } catch (error) {
            this.logger.logError(error);
            throw error;
        }
    }
    public async getInventory(product_id: string): Promise<IInventory> {
        try {
            return await Inventory.findOne({ product_id });
        } catch (error) {
            this.logger.logError(error);
            throw error;
        }
    }
    public async getAllInventories(): Promise<IInventory[]> {
        try {
            return await Inventory.find();
        } catch (error) {
            this.logger.logError(error);
            throw error;
        }
    }
    public async deleteInventory(product_id: string) {
        try {
            return await Inventory.findOneAndDelete({ product_id });
        } catch (error) {
            this.logger.logError(error);
            throw error;
        }
    }
}
