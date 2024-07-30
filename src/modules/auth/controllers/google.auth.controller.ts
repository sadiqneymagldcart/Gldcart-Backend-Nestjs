import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Query,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { GoogleAuthService } from '@auth/services/google.auth.service';
import { setRefreshTokenCookie } from '@common/utils/auth.response.util';

@ApiTags('Google Auth')
@Controller()
export class GoogleAuthController {
  private readonly logger = new Logger(GoogleAuthController.name);

  public constructor(private readonly googleAuthService: GoogleAuthService) { }

  @Get('/tokens/oauth/google')
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
    this.logger.debug(
      'Received OAuth callback with code: ' + code + ' and state: ' + state,
    );

    const oAuthTokens = await this.googleAuthService.getGoogleOAuthTokens(code);
    if (!oAuthTokens) {
      throw new BadRequestException('Invalid OAuth tokens');
    }

    this.logger.debug('Received OAuth tokens: ' + JSON.stringify(oAuthTokens));

    const googleUser = await this.googleAuthService.getGoogleUser(
      oAuthTokens.id_token,
      oAuthTokens.access_token,
    );
    if (!googleUser) {
      throw new UnauthorizedException('Google user not found');
    }

    const userDto = {
      role: state,
      name: googleUser.given_name,
      surname: googleUser.family_name,
      email: googleUser.email,
      picture: googleUser.picture,
      password: process.env.GOOGLE_PASSWORD!,
    };

    const result = await this.googleAuthService.loginGoogleUser(userDto);
    if (!result.refreshToken) {
      this.logger.error('Invalid credentials, no refresh token obtained');
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.debug('Setting refresh token cookie and redirecting user');
    setRefreshTokenCookie(response, result.refreshToken);

    const redirectURL = process.env.CLIENT_URL!;
    return response.redirect(redirectURL);
  }
}
