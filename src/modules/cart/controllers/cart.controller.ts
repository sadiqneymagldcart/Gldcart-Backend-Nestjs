import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ItemDto } from '@item/dto/item.dto';
import { Cart } from '@cart/schemas/cart.schema';
import { CartService } from '@cart/services/cart.service';
import { UpdateItemDto } from '@cart/dto/update-item.dto';

@ApiTags('Carts')
@Controller('cart')
export class CartController {
  public constructor(private readonly cartService: CartService) { }

  @Get('/user/:userId')
  @ApiOperation({ summary: 'Get a cart for user' })
  @ApiOkResponse({ description: 'The cart for user', type: Cart })
  public async getCartByUserId(@Param('userId') userId: string): Promise<Cart> {
    return this.cartService.findCartByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cart by id' })
  @ApiOkResponse({
    description: 'The cart with the matching id with populated items',
    type: Cart,
  })
  @ApiNotFoundResponse({ description: 'No cart found with this id' })
  public async getCartById(@Param('id') id: string): Promise<Cart> {
    return this.cartService.findCartWithItemsById(id);
  }

  @Post(':userId')
  @ApiOperation({ summary: 'Add an item to a cart' })
  @ApiOkResponse({ description: 'The updated cart', type: Cart })
  @ApiBadRequestResponse({ description: 'Invalid item data' })
  public async addItemToCart(
    @Param('userId') userId: string,
    @Body() newItem: ItemDto,
  ): Promise<Cart> {
    return this.cartService.addItemToCart(userId, newItem);
  }

  @Put(':id/item/:itemId')
  @ApiOperation({ summary: 'Update an item quantity in a cart' })
  @ApiBody({ type: UpdateItemDto })
  @ApiOkResponse({ description: 'The updated cart', type: Cart })
  @ApiBadRequestResponse({ description: 'Invalid item data' })
  @ApiNotFoundResponse({ description: 'No cart found with this id' })
  public async updateItemQuantityInCart(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() updateItem: UpdateItemDto,
  ): Promise<Cart> {
    return this.cartService.updateItemQuantityInCart(
      id,
      itemId,
      updateItem.quantity,
    );
  }

  @Delete(':id/item/:itemId')
  @ApiOperation({ summary: 'Remove an item from a cart' })
  @ApiOkResponse({ description: 'The updated cart after removal', type: Cart })
  @ApiNotFoundResponse({ description: 'No cart found with this id' })
  public async removeItemFromCart(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
  ): Promise<Cart> {
    return this.cartService.removeItemFromCart(id, itemId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a cart' })
  @ApiOkResponse({ description: 'The cart has been removed' })
  @ApiNotFoundResponse({ description: 'No cart found with this id' })
  public async removeCartById(@Param('id') id: string): Promise<void> {
    return this.cartService.removeCartById(id);
  }
}
