import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from '@product/dto/create-product.dto';
import { UpdateProductDto } from '@product/dto/update-product.dto';
import { Product, ProductDocument } from '@product/schemas/product.schema';
import { SearchService } from '@search/services/search.service';
import { Pagination } from '@shared/decorators/pagination.decorator';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
  private readonly searchService: SearchService<ProductDocument>;
  public constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.searchService = new SearchService<ProductDocument>(productModel);
  }

  public async getCacheKeys(): Promise<string[]> {
    const redisStore: any = this.cacheManager.store;

    // Execute Redis 'keys' command to get all keys
    return new Promise((resolve, reject) => {
      redisStore.keys('*', (err, keys) => {
        if (err) {
          reject(err);
        }
        resolve(keys);
      });
    });
  }

  public async clearCacheKeys(): Promise<void> {
    const keys = await this.getCacheKeys();
    keys.forEach(async (key: string) => await this.cacheManager.del(key));
  }

  public async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    const savedProduct = await createdProduct.save();

    await this.clearCacheKeys();

    return savedProduct;
  }

  public async getAllProducts(): Promise<Product[]> {
    return this.productModel.find().lean();
  }

  public async getProductById(id: string): Promise<Product> {
    const offering = await this.productModel.findById(id).lean();
    if (!offering) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return offering;
  }

  public async getProductByFilters(
    pagination: Pagination,
    filters: {
      [key: string]: any;
    } = {},
  ): Promise<Product[]> {
    const cachedProducts = await this.cacheManager.get<Product[]>('products');

    console.log('Cache Products : ', cachedProducts);

    return this.searchService.searchWithPaginationAndFilters(
      pagination,
      filters,
    );
  }

  public async getProductBySearchQuery(
    pagination: Pagination,
    searchQuery: string,
  ): Promise<Product[]> {
    return this.searchService.searchWithPaginationAndText(
      pagination,
      searchQuery,
    );
  }

  public async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const existingProduct = await this.productModel.findByIdAndUpdate(
      id,
      updateProductDto,
      { new: true },
    );
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return existingProduct;
  }

  public async updateProductStock(
    productId: string,
    quantity: number,
    session: any,
  ): Promise<void> {
    this.productModel.updateOne(
      { _id: productId },
      { $inc: { stock: -quantity } },
      { session },
    );
  }

  public async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    await this.clearCacheKeys();
  }
}
