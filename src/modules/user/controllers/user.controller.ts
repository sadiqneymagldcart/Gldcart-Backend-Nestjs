import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SerializeWith } from '@shared/decorators/serialize.decorator';
import { CreateUserDto } from '@user/dto/create.user.dto';
import { User } from '@user/schemas/user.schema';
import { UserService } from '@user/services/user.service';

@ApiTags('Users')
@Controller('/users')
@SerializeWith(User)
export class UserController {
  private readonly userService: UserService;
  private readonly logger: Logger = new Logger(UserController.name);

  public constructor(userService: UserService) {
    this.userService = userService;
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users found', type: [User] })
  @HttpCode(HttpStatus.OK)
  @Get()
  public async getUsers(): Promise<User[]> {
    this.logger.log('REST request to get all users');
    return await this.userService.getAll();
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  public async getUser(@Param('id') id: string) {
    this.logger.log(`REST request to get a user: ${id}`);
    return this.userService.findUserById(id);
  }

  @ApiOperation({ summary: 'Create a user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created', type: User })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  public async createUser(@Body() user: CreateUserDto): Promise<User> {
    this.logger.log(`REST request to create a user: ${JSON.stringify(user)}`);
    return this.userService.createAndSaveUser(user);
  }
}
