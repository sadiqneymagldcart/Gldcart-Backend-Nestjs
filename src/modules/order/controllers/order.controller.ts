import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateOrderDto } from '@order/dto/create-order.dto';
import { UpdateOrderDto } from '@order/dto/update-order.dto';
import { Order } from '@order/schemas/order.schema';
import { OrderService } from '@order/services/order.service';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  public constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create order' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The order has been successfully created.',
  })
  @ApiBody({
    type: CreateOrderDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_ACCEPTABLE,
    description: 'Invalid input.',
  })
  public async placeOrder(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve orders' })
  @ApiResponse({ status: 200, description: 'Returned all orders.' })
  public async getAllOrders(): Promise<void> {
    // return this.orderService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve order' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returned one order.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Order not found.',
  })
  public async getOrderById(@Param('id') id: string): Promise<void> {
    // return this.orderService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update order' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The order has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_ACCEPTABLE,
    description: 'Invalid input.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Order not found.',
  })
  public async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<void> {
    // return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete order' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The order has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Order not found.',
  })
  public async removeOrder(@Param('id') id: string): Promise<void> {
    // return this.orderService.remove(id);
  }
}
