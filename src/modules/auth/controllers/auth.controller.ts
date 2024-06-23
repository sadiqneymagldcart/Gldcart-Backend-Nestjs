import {
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  Body,
  Req,
  Res,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthCredentialsDto } from '@auth/dto/auth.credentials.dto';
import { AuthService } from '@auth/services/auth.service';
import { setRefreshTokenCookie } from '@common/utils/auth.response.util';
import { AuthResponseDto } from '@auth/dto/auth.response.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  private readonly authService: AuthService;
  private readonly logger: Logger = new Logger(AuthController.name);

  public constructor(authService: AuthService) {
    this.authService = authService;
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: AuthCredentialsDto, description: 'Login credentials' })
  @ApiResponse({
    status: 200,
    description: 'Login successful.',
    type: AuthResponseDto,
  })
  public async login(
    @Body() credentials: AuthCredentialsDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    this.logger.log(`REST request to login: ${JSON.stringify(credentials)}`);

    const data = await this.authService.login(credentials);

    setRefreshTokenCookie(response, data.refreshToken);

    return plainToInstance(AuthResponseDto, data);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  @ApiOperation({ summary: 'Register' })
  @ApiBody({ type: AuthCredentialsDto, description: 'Registration data' })
  @ApiResponse({
    status: 201,
    description: 'Registration successful.',
    type: AuthResponseDto,
  })
  public async register(
    @Body() credentials: AuthCredentialsDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    this.logger.log(`REST request to register: ${JSON.stringify(credentials)}`);

    const data = await this.authService.register(credentials);

    console.log('data', data);

    setRefreshTokenCookie(response, data.refreshToken);

    return plainToInstance(AuthResponseDto, data);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout' })
  @Post('/logout')
  public async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.logger.log('REST request to logout');

    const refreshToken = request.cookies.refreshToken;

    await this.authService.logout(refreshToken);

    response.clearCookie('refreshToken');

    return { message: 'Logout successful' };
  }

  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed.',
    type: AuthResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/refresh')
  public async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    this.logger.log('REST request to refresh token');

    const refreshToken = request.cookies.refreshToken;

    const data = await this.authService.refresh(refreshToken);

    setRefreshTokenCookie(response, data.refreshToken);

    return plainToInstance(AuthResponseDto, data);
  }
}
