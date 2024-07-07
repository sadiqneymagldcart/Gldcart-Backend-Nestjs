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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateProductDto } from '@product/dto/create-product.dto';
import { UpdateProductDto } from '@product/dto/update-product.dto';
import { Product } from '@product/schemas/product.schema';
import { ProductService } from '@product/services/product.service';

@ApiTags('Products')
@Controller('products')
@UseInterceptors(CacheInterceptor)
export class ProductController {
  public constructor(private readonly productService: ProductService) { }

  @ApiOperation({ summary: 'Create a product' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
  })
  @Post()
  public async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Return all products.' })
  @Get()
  public async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the product with the given ID.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @Get(':id')
  public async findById(@Param('id') id: string): Promise<Product> {
    return this.productService.findById(id);
  }

  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @Put(':id')
  public async update(
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
  public async remove(@Param('id') id: string): Promise<void> {
    return this.productService.remove(id);
  }
}
