import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from '@product/dto/create-product.dto';
import { UpdateProductDto } from '@product/dto/update-product.dto';
import { IProductService } from '@product/interfaces/product.service.interface';
import { Product, ProductDocument } from '@product/schemas/product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductService implements IProductService {
  public constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) { }

  public async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  public async findAll(): Promise<Product[]> {
    return this.productModel.find().lean().exec();
  }

  public async findById(id: string): Promise<Product> {
    const offering = await this.productModel.findById(id).lean().exec();
    if (!offering) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return offering;
  }

  public async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const existingProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return existingProduct;
  }

  public async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}
