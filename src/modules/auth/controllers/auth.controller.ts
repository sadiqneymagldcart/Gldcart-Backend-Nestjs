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
import { AuthService } from '@auth/services/auth.service';
import { AuthResponseDto } from '@auth/dto/auth-response.dto';
import { AuthInterceptor } from '@shared/interceptors/auth.interceptor';
import { LoginCredentialsDto } from '@auth/dto/login-credentials.dto';
import { RegisterCredentialsDto } from '@auth/dto/register-credentials.dto';

@ApiTags('Auth')
@Controller('/auth')
@UseInterceptors(AuthInterceptor)
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginCredentialsDto, description: 'Login credentials' })
  @ApiResponse({
    status: 200,
    description: 'Login successful.',
    type: AuthResponseDto,
  })
  public async login(
    @Body() credentials: LoginCredentialsDto,
  ): Promise<AuthResponseDto> {
    return await this.authService.login(credentials);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  @ApiOperation({ summary: 'Register' })
  @ApiBody({ type: RegisterCredentialsDto, description: 'Registration data' })
  @ApiResponse({
    status: 201,
    description: 'Registration successful.',
    type: AuthResponseDto,
  })
  public async register(
    @Body() credentials: RegisterCredentialsDto,
  ): Promise<AuthResponseDto> {
    return await this.authService.register(credentials);
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
    const refresh_token = request.cookies.refresh_token;
    return await this.authService.refresh(refresh_token);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout' })
  @Post('/logout')
  public async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refresh_token = request.cookies.refresh_token;

    await this.authService.logout(refresh_token);

    response.clearCookie('refresh_token');

    return { message: 'Logout successful' };
  }
}
