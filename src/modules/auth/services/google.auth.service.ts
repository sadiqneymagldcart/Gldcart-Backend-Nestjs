import { Injectable, Logger } from '@nestjs/common';
import { Nullable } from '@shared/types/common';
import { TokenService } from '@token/services/token.service';
import { User } from '@user/schemas/user.schema';
import { UserService } from '@user/services/user.service';
import axios from 'axios';
import * as qs from 'qs';

interface IGoogleUserInfo {
  role: string;
  name: string;
  surname: string;
  email: string;
  picture: string;
  password: string;
}

interface IGoogleTokenResult {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
}

interface IGoogleUserResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

interface IAuthValues {
  code: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  grant_type: string;
}

@Injectable()
export class GoogleAuthService {
  private readonly tokenService: TokenService;
  private readonly userService: UserService;

  private readonly logger: Logger = new Logger(GoogleAuthService.name);

  public constructor(userService: UserService, tokenService: TokenService) {
    this.tokenService = tokenService;
    this.userService = userService;
  }

  public async loginGoogleUser(userInfo: IGoogleUserInfo) {
    const user = await this.updateOrCreateGoogleUser(userInfo);
    return this.authenticateWithGoogle(user, userInfo.picture);
  }

  public async getGoogleOAuthTokens({
    code,
  }: {
    code: string;
  }): Promise<Nullable<IGoogleTokenResult>> {
    this.logger.debug(`Fetching Google OAuth Tokens with code: ${code}`);
    const values = this.getOAuthValues(code);
    this.logger.debug(`OAuth Values: ${JSON.stringify(values)}`);
    try {
      const googleResponse = await this.postToUrl(
        process.env.GOOGLE_TOKEN_URL as string,
        values,
      );
      return googleResponse.data;
    } catch (error: any) {
      console.log(error);
      await this.handleTokenError(error);
    }
  }

  public async getGoogleUser(
    id_token: string,
    access_token: string,
  ): Promise<Nullable<IGoogleUserResult>> {
    try {
      const response = await this.getGoogleUserInfo(id_token, access_token);
      return response.data;
    } catch (error: any) {
      await this.handleUserInfoError(error);
    }
  }

  private async updateOrCreateGoogleUser(
    googleUserData: IGoogleUserInfo,
  ): Promise<User> {
    let existingUser = await this.userService.findUserByEmail(
      googleUserData.email,
    );

    if (!existingUser)
      existingUser = await this.userService.createAndSaveUser({
        role: googleUserData.role,
        name: googleUserData.name,
        surname: googleUserData.surname,
        email: googleUserData.email,
        profile_picture: googleUserData.picture,
        password: googleUserData.password,
      });

    return existingUser;
  }

  private async authenticateWithGoogle(user: any, picture: string) {
    const userInfo = {
      _id: user._id,
      role: user.type,
      name: user.name,
      surname: user.surname,
      email: user.email,
      profile_picture: picture,
    };

    try {
      const refreshToken =
        await this.tokenService.generateRefreshToken(userInfo);
      const accessToken = await this.tokenService.generateAccessToken(userInfo);

      this.logger.debug(`User logged in with Google: ${user.email}`);

      return {
        tokens: {
          accessToken,
          refreshToken,
        },
        user: userInfo,
      };
    } catch (error: any) {
      this.logger.error('Failed to create tokens', error);
      throw new Error('Failed to create tokens');
    }
  }

  private getOAuthValues(code: string): IAuthValues {
    return {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: 'authorization_code',
    };
  }

  private async handleTokenError(error: any): Promise<void> {
    this.logger.error(
      'Failed to fetch Google OAuth Tokens',
      error.response?.data,
    );
    throw new Error(error.response?.data);
  }

  private async postToUrl(url: string, values: IAuthValues) {
    return await axios.post<IGoogleTokenResult>(url, qs.stringify(values), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }

  private async getGoogleUserInfo(id_token: string, access_token: string) {
    return await axios.get<IGoogleUserResult>(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: { Authorization: `Bearer ${id_token}` },
      },
    );
  }

  private async handleUserInfoError(error: any) {
    this.logger.error('Failed to fetch Google User', error.message);
    throw new Error(error.message);
  }
}
