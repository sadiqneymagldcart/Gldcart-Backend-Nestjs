import { CreateAddressDto } from '@address/dto/create-address.dto';
import { UpdateAddressDto } from '@address/dto/update-address.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AwsStorageService } from '@storages/services/storages.service';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { UserService } from '@user/services/user.service';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  public constructor(
    private readonly awsStorage: AwsStorageService,
    private readonly userService: UserService,
  ) { }

  @Put('/:id/profile-picture')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Update user profile picture' })
  @ApiResponse({
    status: 200,
    description: 'Profile picture updated successfully.',
  })
  public async updateProfilePicture(
    @UploadedFiles() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    const image = await this.awsStorage.uploadSingleFile(file);
    return this.userService.updateProfilePicture(id, image);
  }

  @ApiOperation({ summary: 'Get user shipping addresses' })
  @Get('/:id/shipping-addresses')
  public async getShippingAddresses(@Param('id') id: string) {
    return this.userService.getShippingAddresses(id);
  }

  @Post('/:id/shipping-address')
  @ApiOperation({ summary: 'Add shipping address for a user' })
  @ApiResponse({
    status: 201,
    description: 'Shipping address added successfully.',
  })
  @ApiBody({ type: CreateAddressDto })
  public async addShippingAddress(
    @Param('id') id: string,
    @Body() data: CreateAddressDto,
  ) {
    return this.userService.addShippingAddress(id, data);
  }

  @Put('/:id/shipping-address/:addressId')
  @ApiOperation({ summary: 'Update shipping address for a user' })
  @ApiResponse({
    status: 200,
    description: 'Shipping address updated successfully.',
  })
  @ApiBody({ type: UpdateAddressDto })
  public async updateShippingAddress(
    @Param('id') id: string,
    @Param('addressId') addressId: string,
    @Body() data: UpdateAddressDto,
  ) {
    return this.userService.updateShippingAddress(id, addressId, data);
  }

  @Delete('/:id/shipping-address/:addressId')
  @ApiOperation({ summary: 'Delete shipping address for a user' })
  @ApiResponse({
    status: 200,
    description: 'Shipping address deleted successfully.',
  })
  public async deleteShippingAddress(
    @Param('id') id: string,
    @Param('addressId') addressId: string,
  ) {
    return this.userService.removeShippingAddress(id, addressId);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  @ApiBody({ type: UpdateUserDto })
  public async updateProfile(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, data);
  }
}
