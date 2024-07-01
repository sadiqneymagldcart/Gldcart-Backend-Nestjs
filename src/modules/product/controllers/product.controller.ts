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
import { SerializeWith } from '@shared/decorators/serialize.decorator';

@ApiTags('Products')
@Controller('products')
@SerializeWith(Product)
export class ProductController {
  public constructor(private readonly offeringService: ProductService) {}

  @ApiOperation({ summary: 'Create an offering' })
  @ApiResponse({
    status: 201,
    description: 'The offering has been successfully created.',
  })
  @Post()
  public async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.offeringService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Get all offerings' })
  @ApiResponse({ status: 200, description: 'Return all offerings.' })
  @Get()
  @UseInterceptors(CacheInterceptor)
  public async findAll(): Promise<Product[]> {
    return this.offeringService.findAll();
  }

  @ApiOperation({ summary: 'Get an offering by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the offering with the given ID.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  public async findById(@Param('id') id: string): Promise<Product> {
    return this.offeringService.findById(id);
  }

  @ApiOperation({ summary: 'Update an offering by ID' })
  @ApiResponse({
    status: 200,
    description: 'The offering has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.offeringService.update(id, updateProductDto);
  }

  @ApiOperation({ summary: 'Delete an offering by ID' })
  @ApiResponse({
    status: 204,
    description: 'The offering has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<void> {
    return this.offeringService.remove(id);
  }
}
