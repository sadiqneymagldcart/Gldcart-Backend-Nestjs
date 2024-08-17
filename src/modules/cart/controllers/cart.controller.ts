import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CreateItemDto } from '@item/dto/create-item.dto';
import { Cart } from '@cart/schemas/cart.schema';
import { CartService } from '@cart/services/cart.service';
import { UpdateItemDto } from '@item/dto/update-item.dto';
import { TransactionInterceptor } from '@shared/interceptors/transaction.interceptor';
import { AddShippingOptionsDto } from '@shipping/dtos/add-shipping-option.dto';
import { RemoveShippingOptionDto } from '@shipping/dtos/remove-shipping-option.dto';

@ApiTags('Carts')
@Controller('cart')
@UseInterceptors(CacheInterceptor)
export class CartController {
  public constructor(private readonly cartService: CartService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get a cart by user id' })
  public async getCartByUserId(@Param('userId') userId: string) {
    return this.cartService.getWithItemsByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cart by id' })
  @ApiNotFoundResponse({ description: 'No cart found with this id' })
  public async getCartById(@Param('id') id: string) {
    return this.cartService.getWithItemsById(id);
  }

  @Post(':userId')
  @ApiOperation({ summary: 'Add an item to a cart' })
  @ApiOkResponse({ description: 'The updated cart', type: Cart })
  @ApiBadRequestResponse({ description: 'Invalid item data' })
  @UseInterceptors(TransactionInterceptor)
  public async addItemToCart(
    @Param('userId') userId: string,
    @Body() newItem: CreateItemDto,
  ) {
    return this.cartService.addItem(userId, newItem);
  }

  @Put(':id/item/:itemId')
  @ApiOperation({ summary: 'Update an item quantity in a cart' })
  @ApiBody({ type: UpdateItemDto })
  @ApiBadRequestResponse({ description: 'Invalid item data' })
  @ApiNotFoundResponse({ description: 'No cart found with this id' })
  @UseInterceptors(TransactionInterceptor)
  public async updateItemQuantityInCart(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() updateItem: UpdateItemDto,
  ) {
    return this.cartService.updateItemQuantity(id, itemId, updateItem);
  }

  @Delete(':id/item/:itemId')
  @ApiOperation({ summary: 'Remove an item from a cart' })
  @ApiNotFoundResponse({ description: 'No cart found with this id' })
  @UseInterceptors(TransactionInterceptor)
  public async removeItemFromCart(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
  ) {
    return this.cartService.removeItem(id, itemId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a cart' })
  @ApiOkResponse({ description: 'The cart has been removed' })
  @ApiNotFoundResponse({ description: 'No cart found with this id' })
  @UseInterceptors(TransactionInterceptor)
  public async removeCartById(@Param('id') id: string) {
    return this.cartService.removeCart(id);
  }

  @Post('add-shipping/:id')
  @ApiOperation({ summary: 'Add a shipping option to a cart' })
  public async addShippingOption(
    @Param('id') id: string,
    @Body() data: AddShippingOptionsDto,
  ) {
    return this.cartService.addShippingOption(id, data);
  }

  @Delete('remove-shipping/:id')
  @ApiOperation({ summary: 'Remove a shipping option from a cart' })
  public async removeShippingOption(
    @Param('id') id: string,
    @Body() data: RemoveShippingOptionDto,
  ) {
    return this.cartService.removeShippingOption(id, data);
  }
}
