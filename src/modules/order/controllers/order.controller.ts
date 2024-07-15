import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateOrderDto } from '@order/dto/create-order.dto';
import { UpdateOrderDto } from '@order/dto/update-order.dto';
import { OrderService } from '@order/services/order.service';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  public constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create order' })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  public async createOrder(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<void> {
    // return this.orderService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve orders' })
  @ApiResponse({ status: 200, description: 'Returned all orders.' })
  public async getAllOrders(): Promise<void> {
    // return this.orderService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve order' })
  @ApiResponse({ status: 200, description: 'Returned one order.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  public async getOrderById(@Param('id') id: string): Promise<void> {
    // return this.orderService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update order' })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  public async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<void> {
    // return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete order' })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  public async removeOrder(@Param('id') id: string): Promise<void> {
    // return this.orderService.remove(id);
  }
}
