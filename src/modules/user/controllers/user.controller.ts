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
import { CreateUserDto } from '@user/dto/create-user.dto';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { User } from '@user/schemas/user.schema';
import { UserService } from '@user/services/user.service';

@ApiTags('Users')
@Controller('/users')
export class UserController {
  private readonly logger: Logger = new Logger(UserController.name);

  public constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users found', type: [User] })
  @HttpCode(HttpStatus.OK)
  @Get()
  public async findAll(): Promise<User[]> {
    this.logger.log('REST request to get all users');
    return await this.userService.findAll();
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  public async findOne(@Param('id') id: string): Promise<User> {
    this.logger.log(`REST request to get a user: ${id}`);
    return this.userService.findById(id);
  }

  @ApiOperation({ summary: 'Create a user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created', type: User })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  public async create(@Body() user: CreateUserDto): Promise<User> {
    this.logger.log(`REST request to create a user: ${JSON.stringify(user)}`);
    return this.userService.create(user);
  }

  @ApiOperation({ summary: 'Update a user by id' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated', type: User })
  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  public async update(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    this.logger.log(`REST request to update a user: ${id}`);
    return this.userService.update(id, user);
  }

  @ApiOperation({ summary: 'Delete a user by id' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  public async remove(@Param('id') id: string): Promise<void> {
    this.logger.log(`REST request to delete a user: ${id}`);
    return this.userService.remove(id);
  }
}
