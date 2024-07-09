import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateProductDto } from '@product/dto/create-product.dto';
import { UpdateProductDto } from '@product/dto/update-product.dto';
import { Product } from '@product/schemas/product.schema';
import { ProductService } from '@product/services/product.service';
import { AwsStorageService } from '@storages/services/storages.service';

@ApiTags('Products')
@Controller('products')
@UseInterceptors(CacheInterceptor)
export class ProductController {
  public constructor(
    private readonly productService: ProductService,
    private readonly awsStorage: AwsStorageService,
  ) { }

  @ApiOperation({ summary: 'Create a product' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
  })
  @UseInterceptors(FileInterceptor('images'))
  @Post()
  public async createProduct(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    const imageUrls = await this.awsStorage.upload(images);
    const productWithImages = { ...createProductDto, images: imageUrls };
    return this.productService.create(productWithImages);
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Return all products.' })
  @Get()
  public async getAllProducts(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the product with the given ID.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @Get(':id')
  public async getByProductById(@Param('id') id: string): Promise<Product> {
    return this.productService.findById(id);
  }

  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @Put(':id')
  public async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({
    status: 204,
    description: 'The product has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @Delete(':id')
  public async removeProduct(@Param('id') id: string): Promise<void> {
    return this.productService.remove(id);
  }
}
