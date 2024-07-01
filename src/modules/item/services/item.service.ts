import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '@product/schemas/product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ItemService {
  private readonly logger = new Logger(ItemService.name);

  public constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  public async updateStock(itemId: string, quantity: number) {
    this.logger.log(`Updating stock for item ${itemId}`);
    const session = await this.productModel.startSession();
    session.startTransaction();
    try {
      const item = await this.productModel
        .findOne({ itemId })
        .select('stock')
        .session(session);
      if (!item) {
        this.logger.error(`Item with ID ${itemId} not found`);
        throw new NotFoundException(`Item with ID ${itemId} not found`);
      }
      if (item.stock < quantity) {
        this.logger.error(`Insufficient stock for item ${itemId}`);
        throw new BadRequestException(`Insufficient stock for item ${itemId}`);
      }
      const updatedItem = await this.productModel.findOneAndUpdate(
        { itemId },
        { $inc: { stock: -quantity } },
        { new: true, session },
      );
      await session.commitTransaction();
      this.logger.log(`Stock for item ${itemId} updated successfully`);
      return updatedItem;
    } catch (error) {
      await session.abortTransaction();
      this.logger.error(
        `Failed to update stock for item ${itemId}: ${error.message}`,
      );
      throw error;
    } finally {
      session.endSession();
    }
  }
}
