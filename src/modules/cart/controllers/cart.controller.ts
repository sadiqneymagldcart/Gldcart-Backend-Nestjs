import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CartItemDto } from '@cart/dto/cart-item.dto';
import { Cart } from '@cart/schemas/cart.schema';
import { CartService } from '@cart/services/cart.service';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  public constructor(private readonly cartService: CartService) { }

  @Get()
  @ApiOperation({ summary: 'Get all carts' })
  @ApiOkResponse({ description: 'The list of all carts', type: [Cart] })
  async findAll(): Promise<Cart[]> {
    return this.cartService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cart by id' })
  @ApiOkResponse({ description: 'The cart with the matching id', type: Cart })
  @ApiNotFoundResponse({ description: 'No cart found with this id' })
  async findOne(@Param('id') id: string): Promise<Cart> {
    const cart = await this.cartService.findOne(id);
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return cart;
  }

  @Post(':userId')
  @ApiOperation({ summary: 'Add an item to a cart' })
  @ApiOkResponse({ description: 'The updated cart', type: Cart })
  @ApiBadRequestResponse({ description: 'Invalid item data' })
  async addItem(
    @Param('userId') userId: string,
    @Body() newItem: CartItemDto,
  ): Promise<Cart> {
    return this.cartService.addItem(userId, newItem);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an item in a cart' })
  @ApiOkResponse({ description: 'The updated cart', type: Cart })
  @ApiBadRequestResponse({ description: 'Invalid item data' })
  @ApiNotFoundResponse({ description: 'No cart found with this id' })
  async updateItem(
    @Param('id') id: string,
    @Body() updateItem: CartItemDto,
  ): Promise<Cart> {
    return this.cartService.updateItem(id, updateItem);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a cart' })
  @ApiOkResponse({ description: 'The cart has been removed' })
  @ApiNotFoundResponse({ description: 'No cart found with this id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.cartService.remove(id);
  }
}
