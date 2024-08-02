import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { stringify } from 'qs';
import { plainToInstance } from 'class-transformer';
import { AxiosResponse } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import { TokenService } from '@token/services/token.service';
import { UserService } from '@user/services/user.service';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { AuthResponseDto } from '@auth/dto/auth-response.dto';
import { CreateTokenDto } from '@token/dto/create-token.dto';
import { GoogleToken } from '@auth/interfaces/google-token.interface';
import { GoogleUser } from '@auth/interfaces/google-user.interface';

@Injectable()
export class GoogleAuthService {
  private readonly logger = new Logger(GoogleAuthService.name);

  private readonly googleClientId: string;
  private readonly googleClientSecret: string;
  private readonly googleRedirectUri: string;
  private readonly googleTokenUrl: string;
  private readonly googleGrantType: string;
  private readonly googleApiUrl: string;

  public constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.googleClientSecret = this.configService.get<string>(
      'GOOGLE_CLIENT_SECRET',
    )!;
    this.googleRedirectUri = this.configService.get<string>(
      'GOOGLE_REDIRECT_URI',
    )!;
    this.googleTokenUrl = this.configService.get<string>('GOOGLE_TOKEN_URL');
    this.googleGrantType = this.configService.get<string>('GOOGLE_GRANT_TYPE');
    this.googleApiUrl = this.configService.get<string>('GOOGLE_API_URL');
  }

  public async authenticateWithGoogle(
    code: string,
    state: string,
  ): Promise<AuthResponseDto> {
    this.logger.debug(
      `Received OAuth callback with code: ${code} and state: ${state}`,
    );

    const oAuthTokens = await this.fetchGoogleOAuthTokens(code);
    const googleUser = await this.fetchGoogleUser(
      oAuthTokens.id_token,
      oAuthTokens.access_token,
    );

    const userDto: CreateUserDto = {
      role: state,
      name: googleUser.given_name,
      surname: googleUser.family_name,
      email: googleUser.email,
      profile_picture: googleUser.picture,
      password: process.env.GOOGLE_PASSWORD!,
    };

    const result = await this.loginGoogleUser(userDto);
    if (!result.refreshToken) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return result;
  }

  private async fetchGoogleOAuthTokens(code: string): Promise<GoogleToken> {
    this.logger.debug(`Fetching Google OAuth Tokens with code: ${code}`);
    const response = await firstValueFrom(
      this.httpService
        .post<GoogleToken>(
          this.googleTokenUrl,
          stringify(this.getOAuthValues(code)),
        )
        .pipe(map((response: AxiosResponse<GoogleToken>) => response.data)),
    );
    if (!response) {
      throw new BadRequestException('Invalid OAuth tokens');
    }
    this.logger.debug(`Received OAuth tokens: ${JSON.stringify(response)}`);
    return response;
  }

  private async fetchGoogleUser(
    id_token: string,
    access_token: string,
  ): Promise<GoogleUser> {
    this.logger.debug(
      `Fetching Google user info with id_token: ${id_token} and access_token: ${access_token}`,
    );
    const response = await firstValueFrom(
      this.httpService
        .get<GoogleUser>(`${this.googleApiUrl}=${access_token}`, {
          headers: { Authorization: `Bearer ${id_token}` },
        })
        .pipe(map((response: AxiosResponse<GoogleUser>) => response.data)),
    );
    if (!response) {
      throw new UnauthorizedException('Google user not found');
    }
    return response;
  }

  public async loginGoogleUser(user: CreateUserDto): Promise<AuthResponseDto> {
    const userDto = plainToInstance(
      CreateTokenDto,
      await this.userService.create(user),
      {
        excludeExtraneousValues: true,
      },
    );
    return this.authorizeWithGoogle(userDto);
  }

  private async authorizeWithGoogle(
    tokenPayload: CreateTokenDto,
  ): Promise<AuthResponseDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(tokenPayload),
      this.tokenService.generateRefreshToken(tokenPayload),
    ]);
    return {
      accessToken,
      refreshToken,
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
}
