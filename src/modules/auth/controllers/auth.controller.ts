import {
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  Body,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthCredentialsDto } from '@auth/dto/auth.credentials.dto';
import { AuthService } from '@auth/services/auth.service';
import { AuthResponseDto } from '@auth/dto/auth.response.dto';
import { AuthInterceptor } from '@shared/interceptors/auth.interceptor';

@ApiTags('Auth')
@Controller('/auth')
@UseInterceptors(AuthInterceptor)
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

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
  ): Promise<AuthResponseDto> {
    return await this.authService.login(credentials);
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
  ): Promise<AuthResponseDto> {
    return await this.authService.register(credentials);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout' })
  @Post('/logout')
  public async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
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
  public async refresh(@Req() request: Request): Promise<AuthResponseDto> {
    const refreshToken = request.cookies.refreshToken;
    return await this.authService.refresh(refreshToken);
  }
}
