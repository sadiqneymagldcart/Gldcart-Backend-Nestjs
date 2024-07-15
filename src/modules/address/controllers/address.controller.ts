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
  ApiExcludeController,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateAddressDto } from '@address/dto/create-address.dto';
import { UpdateAddressDto } from '@address/dto/update-address.dto';
import { Address } from '@address/schemas/address.schema';
import { AddressService } from '@address/services/address.service';

@ApiExcludeController()
@Controller('address')
export class AddressController {
  public constructor(private readonly addressService: AddressService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new address' })
  @ApiResponse({
    status: 201,
    description: 'The address has been successfully created.',
  })
  public async createNewAddress(
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    return this.addressService.createAddress(createAddressDto);
  }

  @Get(':user_id')
  @ApiOperation({ summary: 'Get all addresses for a user' })
  @ApiResponse({ status: 200, description: 'Return all addresses for a user.' })
  public async getAllUserAddresses(
    @Param('user_id') user_id: string,
  ): Promise<Address[]> {
    return this.addressService.getAllAddressesForUser(user_id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an address' })
  @ApiResponse({
    status: 200,
    description: 'The address has been successfully updated.',
  })
  public async updateExistingAddress(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    return this.addressService.updateAddress(id, updateAddressDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an address' })
  @ApiResponse({
    status: 200,
    description: 'The address has been successfully deleted.',
  })
  public async deleteAddress(
    @Param('user_id') user_id: string,
    @Param('id') id: string,
  ): Promise<Address[]> {
    return this.addressService.removeAddressAndReturnRemaining(user_id, id);
  }
}
