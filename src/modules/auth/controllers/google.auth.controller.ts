import { GoogleAuthService } from '@auth/services/google.auth.service';
import { setRefreshTokenCookie } from '@common/utils/auth.response.util';
import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Google Auth')
@Controller()
export class GoogleAuthController {
  private readonly googleAuthService: GoogleAuthService;
  private readonly googlePassword = process.env.GOOGLE_PASSWORD!;

  public constructor(googleAuthService: GoogleAuthService) {
    this.googleAuthService = googleAuthService;
  }

  @Get('/tokens/oauth/google')
  public async googleAuthWebhook(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() response: Response,
  ) {
    const oAuthTokens = await this.googleAuthService.getGoogleOAuthTokens({
      code,
    });
    if (oAuthTokens == null) {
      return response.status(400).send('Invalid OAuth Tokens');
    }

    const googleUser = await this.googleAuthService.getGoogleUser(
      oAuthTokens.id_token,
      oAuthTokens.access_token,
    );

    if (!googleUser) {
      return;
    }

    const userInfo = {
      role: state,
      name: googleUser.given_name,
      surname: googleUser.family_name,
      email: googleUser.email,
      picture: googleUser.picture,
      password: this.googlePassword,
    };

    const result = await this.googleAuthService.loginGoogleUser(userInfo);

    if (!result.tokens) {
      return response.status(401).send('Unauthorized');
    }

    setRefreshTokenCookie(response, result.tokens.refreshToken);
    const redirectURL = `${process.env.CLIENT_URL}` as string;
    response.redirect(redirectURL);
  }
}
