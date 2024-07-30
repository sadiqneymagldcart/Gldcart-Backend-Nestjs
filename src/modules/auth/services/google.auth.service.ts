import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { stringify } from 'qs';
import { plainToInstance } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '@token/services/token.service';
import { UserService } from '@user/services/user.service';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { AuthResponseDto } from '@auth/dto/auth-response.dto';
import { CreateTokenDto } from '@token/dto/create-token.dto';
import { GoogleToken } from '@auth/interfaces/google-token.interface';
import { GoogleUser } from '@auth/interfaces/google-user.interface';
import { Nullable } from '@shared/types/common';

@Injectable()
export class GoogleAuthService {
  private readonly googleClientId: string;
  private readonly googleClientSecret: string;
  private readonly googleRedirectUri: string;
  private readonly googleTokenUrl: string;
  private readonly googleGrantType: string;

  private readonly axiosInstance: AxiosInstance;

  private readonly logger: Logger;

  public constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {
    this.googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID')!;
    this.googleClientSecret = this.configService.get<string>(
      'GOOGLE_CLIENT_SECRET',
    )!;
    this.googleRedirectUri = this.configService.get<string>(
      'GOOGLE_REDIRECT_URI',
    )!;
    this.googleTokenUrl = this.configService.get<string>('GOOGLE_TOKEN_URL')!;
    this.googleGrantType = this.configService.get<string>('GOOGLE_GRANT_TYPE')!;
    this.logger = new Logger(GoogleAuthService.name);
    this.axiosInstance = axios.create({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  public async loginGoogleUser(
    createUserDto: CreateUserDto,
  ): Promise<AuthResponseDto> {
    const userDto = plainToInstance(
      CreateTokenDto,
      await this.userService.create(createUserDto),
      {
        excludeExtraneousValues: true,
      },
    );
    return this.authorizeWithGoogle(userDto);
  }

  public async getGoogleOAuthTokens(
    code: string,
  ): Promise<Nullable<GoogleToken>> {
    this.logger.debug(`Fetching Google OAuth Tokens with code: ${code}`);

    const googleResponse = await this.postToUrl<GoogleToken>(
      this.googleTokenUrl,
      this.getOAuthValues(code),
    );
    return googleResponse.data;
  }

  public async getGoogleUser(
    id_token: string,
    access_token: string,
  ): Promise<Nullable<GoogleUser>> {
    const response = await this.getGoogleUserInfo(id_token, access_token);
    return response.data;
  }

  private async authorizeWithGoogle(
    tokenPayload: CreateTokenDto,
  ): Promise<AuthResponseDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(tokenPayload),
      this.tokenService.generateRefreshToken(tokenPayload),
    ]);
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: tokenPayload,
    };
  }

  private getOAuthValues(code: string) {
    return {
      code,
      client_id: this.googleClientId,
      client_secret: this.googleClientSecret,
      redirect_uri: this.googleRedirectUri,
      grant_type: this.googleGrantType,
    };
  }

  private async postToUrl<T>(
    url: string,
    values: any,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, stringify(values));
  }

  private async getGoogleUserInfo(id_token: string, access_token: string) {
    this.logger.debug(
      `Fetching Google user info with id_token: ${id_token} and accessToken: ${access_token}`,
    );
    return axios.get<GoogleUser>(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: { Authorization: `Bearer ${id_token}` },
      },
    );
  }
}
