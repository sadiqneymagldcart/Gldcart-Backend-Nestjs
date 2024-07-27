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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
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

  @Post()
  @ApiOperation({ summary: 'Create a product' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images'))
  public async createProduct(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() product: CreateProductDto,
  ): Promise<Product> {
    const imageUrls = await this.awsStorage.uploadMultipleFiles(images);
    const productWithImages = { ...product, images: imageUrls };
    return this.productService.create(productWithImages);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Return all products.' })
  public async getAllProducts(): Promise<Product[]> {
    return this.productService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the product with the given ID.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  public async getByProductById(@Param('id') id: string): Promise<Product> {
    return this.productService.getById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  public async updateProduct(
    @Param('id') id: string,
    @Body() product: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, product);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({
    status: 204,
    description: 'The product has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  public async removeProduct(@Param('id') id: string): Promise<void> {
    return this.productService.remove(id);
  }
}
