import { Controller, Get, Logger, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { GoogleAuthService } from '@auth/services/google.auth.service';
import { setRefreshTokenCookie } from '@common/utils/auth.response.util';

@ApiTags('Google Auth')
@Controller()
export class GoogleAuthController {
  private readonly logger = new Logger(GoogleAuthController.name);

  public constructor(private readonly googleAuthService: GoogleAuthService) { }

  @Get('tokens/oauth/google')
  @ApiOperation({ summary: 'Google OAuth Callback' })
  @ApiQuery({
    name: 'code',
    required: true,
    description: 'OAuth authorization code',
  })
  @ApiQuery({
    name: 'state',
    required: true,
    description:
      'State parameter to maintain state between the request and callback. Used to store user role.',
  })
  public async googleAuthWebhook(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() response: Response,
  ) {
    const result = await this.googleAuthService.handleGoogleAuth(code, state);
    this.logger.debug('Setting refresh token cookie and redirecting user');
    setRefreshTokenCookie(response, result.refreshToken);
    const redirectURL = process.env.CLIENT_URL!;
    return response.redirect(redirectURL);
  }
}
