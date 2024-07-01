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
import { SerializeWith } from '@shared/decorators/serialize.decorator';

@ApiTags('Carts')
@Controller('cart')
@SerializeWith(Cart)
export class CartController {
  public constructor(private readonly cartService: CartService) { }

  @Get('/user/:userId')
  @ApiOperation({ summary: 'Get a cart for user' })
  @ApiOkResponse({ description: 'The cart for user', type: Cart })
  public async findAllItemsByUserId(
    @Param('userId') userId: string,
  ): Promise<Cart> {
    return this.cartService.findByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cart by id' })
  @ApiOkResponse({ description: 'The cart with the matching id', type: Cart })
  @ApiNotFoundResponse({ description: 'No cart found with this id' })
  public async findOne(@Param('id') id: string): Promise<Cart> {
    return await this.cartService.findOne(id);
  }

  @Post(':userId')
  @ApiOperation({ summary: 'Add an item to a cart' })
  @ApiOkResponse({ description: 'The updated cart', type: Cart })
  @ApiBadRequestResponse({ description: 'Invalid item data' })
  public async addItem(
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
  public async updateItem(
    @Param('id') id: string,
    @Body() updateItem: CartItemDto,
  ): Promise<Cart> {
    return this.cartService.updateItem(id, updateItem);
  }

  @Delete(':id/item/:itemId')
  @ApiOperation({ summary: 'Remove an item from a cart' })
  @ApiOkResponse({ description: 'The updated cart after removal', type: Cart })
  @ApiNotFoundResponse({ description: 'No cart found with this id' })
  public async removeItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
  ): Promise<Cart> {
    return this.cartService.removeItem(id, itemId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a cart' })
  @ApiOkResponse({ description: 'The cart has been removed' })
  @ApiNotFoundResponse({ description: 'No cart found with this id' })
  public async remove(@Param('id') id: string): Promise<void> {
    return this.cartService.remove(id);
  }
}
