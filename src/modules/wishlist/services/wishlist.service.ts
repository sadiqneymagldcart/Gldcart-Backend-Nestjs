import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateItemDto } from '@item/dto/create-item.dto';
import { Item } from '@item/schemas/item.schema';
import { Wishlist, WishlistDocument } from '@wishlist/schemas/wishlist.schema';
import { IWishlistService } from '@wishlist/interfaces/wishlist.service.interface';

@Injectable()
export class WishlistService implements IWishlistService {
  private readonly logger = new Logger(WishlistService.name);

  public constructor(
    @InjectModel(Wishlist.name)
    private readonly wishlistModel: Model<WishlistDocument>,
  ) {}

  public async getByUserId(user_id: string): Promise<Wishlist> {
    const wishlist = await this.wishlistModel.findOne({ customer: user_id });
    if (!wishlist) {
      throw new NotFoundException(
        `No wishlists found for user with id ${user_id}`,
      );
    }
    return wishlist;
  }

  public async getById(id: string): Promise<Wishlist> {
    const wishlist = await this.wishlistModel.findById(id);
    if (!wishlist) {
      throw new NotFoundException(`Wishlist with ID ${id} not found`);
    }
    return wishlist;
  }

  public async getWithItemsById(id: string): Promise<Wishlist> {
    const wishlist = await this.wishlistModel
      .findById(id)
      .populate('items.id', 'name price')
      .exec();

    if (!wishlist) {
      throw new NotFoundException(`Wishlist with ID ${id} not found`);
    }

    return wishlist;
  }

  public async addItem(
    user_id: string,
    newItem: CreateItemDto,
  ): Promise<Wishlist> {
    const existingWishlist = await this.wishlistModel.findOne({
      customer: user_id,
    });

    if (!existingWishlist) {
      const wishlist = new this.wishlistModel({
        customer: user_id,
        items: [newItem],
      });
      this.logger.log(`Created new wishlist for user ${user_id}`);
      return wishlist.save();
    } else {
      const itemExists = existingWishlist.items.some(
        (i) => i.id === newItem.id && i.type === newItem.type,
      );

      if (!itemExists) {
        existingWishlist.items.push(newItem);
        this.logger.log(
          `Added new item ${newItem.id} to wishlist ${existingWishlist.id}`,
        );
      }
      return existingWishlist.save();
    }
  }

  public async removeItem(
    id: string,
    itemId: string,
  ): Promise<Wishlist> {
    const existingWishlist = await this.getByIdOrThrow(id);

    const itemIndex = existingWishlist.items.findIndex(
      (item: Item) => item.id === itemId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException(`Item with ID ${id} not found in wishlist`);
    }

    existingWishlist.items.splice(itemIndex, 1);

    return existingWishlist.save();
  }

  public async remove(id: string): Promise<Wishlist> {
    const result = await this.wishlistModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Wishlist with ID ${id} not found`);
    }
    return result;
  }

  private async getByIdOrThrow(id: string): Promise<WishlistDocument> {
    const wishlist = await this.wishlistModel.findById(id);
    if (!wishlist) {
      throw new NotFoundException(`Wishlist with ID ${id} not found`);
    }
    return wishlist;
  }
}
