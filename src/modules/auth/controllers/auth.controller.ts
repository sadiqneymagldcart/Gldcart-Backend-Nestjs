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
@Controller('auth')
@UseInterceptors(AuthInterceptor)
export class AuthController {
  public constructor(private readonly authService: AuthService) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginCredentialsDto, description: 'Login credentials' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful.',
    type: AuthResponseDto,
  })
  public async login(
    @Body() credentials: LoginCredentialsDto,
  ): Promise<AuthResponseDto> {
    return await this.authService.login(credentials);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register' })
  @ApiBody({ type: RegisterCredentialsDto, description: 'Registration data' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Registration successful.',
    type: AuthResponseDto,
  })
  public async register(
    @Body() credentials: RegisterCredentialsDto,
  ): Promise<AuthResponseDto> {
    return await this.authService.register(credentials);
  }

  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token refreshed.',
    type: AuthResponseDto,
  })
  public async refresh(@Req() request: Request): Promise<AuthResponseDto> {
    const refreshToken = request.cookies.refreshToken;
    return await this.authService.refresh(refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout' })
  public async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies.refreshToken;

    await this.authService.logout(refreshToken);

    response.clearCookie('refreshToken');

    return { message: 'Logout successful' };
  }
}
