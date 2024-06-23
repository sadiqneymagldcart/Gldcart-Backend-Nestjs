import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { TokenService } from '@token/services/token.service';
import { UserService } from '@user/services/user.service';
import { AuthCredentialsDto } from '@auth/dto/auth.credentials.dto';
import { CreateTokenDto } from '@token/dto/create.tokens.dto';
import { AuthResponseDto } from '@auth/dto/auth.response.dto';
import { IAuthService } from '@auth/interfaces/auth.service.interface';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements IAuthService {
  private readonly userService: UserService;
  private readonly tokenService: TokenService;
  private readonly logger: Logger = new Logger(AuthService.name);

  public constructor(userService: UserService, tokenService: TokenService) {
    this.userService = userService;
    this.tokenService = tokenService;
  }

  public async login(
    credentials: AuthCredentialsDto,
  ): Promise<AuthResponseDto> {
    const user = await this._validateUser(credentials);
    return this._generateAuthResponse(user);
  }

  public async register(
    credentials: AuthCredentialsDto,
  ): Promise<AuthResponseDto> {
    const existingUser = await this.userService.findUserByEmail(
      credentials.email,
    );
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(credentials.password, 10);
    const user = await this.userService.createAndSaveUser({
      ...credentials,
      password: hashedPassword,
    });

    const userWithoutPassword = plainToInstance(CreateTokenDto, user, {
      excludeExtraneousValues: true,
    });

    this.logger.log(`User created: ${JSON.stringify(userWithoutPassword)}`);

    return this._generateAuthResponse(userWithoutPassword);
  }

  public async refresh(token: string): Promise<AuthResponseDto> {
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    const userPayload = await this.tokenService.verifyRefreshToken(token);

    if (!userPayload) {
      throw new UnauthorizedException('Invalid token');
    }

    return this._generateAuthResponse(userPayload);
  }

  public async logout(refreshToken: string): Promise<void> {
    await this.tokenService.revokeRefreshToken(refreshToken);
  }

  private async _generateAuthResponse(
    user: CreateTokenDto,
  ): Promise<AuthResponseDto> {
    const accessToken = await this.tokenService.generateAccessToken(user);
    const refreshToken = await this.tokenService.generateRefreshToken(user);
    return { accessToken, refreshToken, user };
  }

  private async _validateUser(
    credentials: AuthCredentialsDto,
  ): Promise<CreateTokenDto> {
    const user = await this.userService.findUserByEmail(credentials.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return plainToInstance(CreateTokenDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
