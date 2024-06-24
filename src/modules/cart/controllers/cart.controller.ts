import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SerializeWith } from '@shared/decorators/serialize.decorator';
import { Cart } from '../schemas/cart.schema';
import { CartService } from '../services/cart.service';
import { CreateCartDto } from '../dto/create-cart.dto';
import { UpdateCartDto } from '../dto/update-cart.dto';

@ApiTags('Carts')
@Controller('/carts')
@SerializeWith(Cart)
export class CartController {
  private readonly logger: Logger = new Logger(CartController.name);

  public constructor(private readonly cartService: CartService) { }

  @ApiOperation({ summary: 'Get all carts' })
  @ApiResponse({ status: 200, description: 'Carts found', type: [Cart] })
  @HttpCode(HttpStatus.OK)
  @Get()
  public async findAll(): Promise<Cart[]> {
    this.logger.log('REST request to get all carts');
    return await this.cartService.findAll();
  }

  @ApiOperation({ summary: 'Get cart by id' })
  @ApiResponse({ status: 200, description: 'Cart found', type: Cart })
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  public async findOne(@Param('id') id: string): Promise<Cart> {
    this.logger.log(`REST request to get a cart: ${id}`);
    return this.cartService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a cart' })
  @ApiBody({ type: CreateCartDto })
  @ApiResponse({ status: 201, description: 'Cart created', type: Cart })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  public async create(@Body() createCartDto: CreateCartDto): Promise<Cart> {
    this.logger.log(
      `REST request to create a cart: ${JSON.stringify(createCartDto)}`,
    );
    return this.cartService.create(createCartDto);
  }

  @ApiOperation({ summary: 'Update a cart by id' })
  @ApiBody({ type: UpdateCartDto })
  @ApiResponse({ status: 200, description: 'Cart updated', type: Cart })
  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  public async update(
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartDto,
  ): Promise<Cart> {
    this.logger.log(`REST request to update a cart: ${id}`);
    return this.cartService.update(id, updateCartDto);
  }

  @ApiOperation({ summary: 'Delete a cart by id' })
  @ApiResponse({ status: 204, description: 'Cart deleted' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  public async remove(@Param('id') id: string): Promise<void> {
    this.logger.log(`REST request to delete a cart: ${id}`);
    return this.cartService.remove(id);
  }
}
