import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { TokenService } from '@token/services/token.service';
import { UserService } from '@user/services/user.service';
import { LoginCredentialsDto } from '@auth/dto/login-credentials.dto';
import { AuthResponseDto } from '@auth/dto/auth-response.dto';
import { CreateTokenDto } from '@token/dto/create-token.dto';
import { IAuthService } from '@auth/interfaces/auth.service.interface';
import { RegisterCredentialsDto } from '@auth/dto/register-credentials.dto';
import { plainToInstance } from 'class-transformer';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements IAuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  public constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  public async login(
    credentials: LoginCredentialsDto,
  ): Promise<AuthResponseDto> {
    const user = await this.validateUser(credentials);
    return this.generateAuthResponse(user);
  }

  public async register(
    credentials: RegisterCredentialsDto,
  ): Promise<AuthResponseDto> {
    const existingUser = await this.userService.getByEmail(credentials.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(credentials.password, 10);
    const user = await this.userService.create({
      ...credentials,
      password: hashedPassword,
    });

    const userWithoutPassword = plainToInstance(CreateTokenDto, user, {
      excludeExtraneousValues: true,
    });

    this.logger.debug(
      `User without password: ${JSON.stringify(userWithoutPassword)}`,
    );

    return this.generateAuthResponse(userWithoutPassword);
  }

  public async refresh(token: string): Promise<AuthResponseDto> {
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    const userPayload = await this.tokenService.verifyRefreshToken(token);

    return this.generateAuthResponse(userPayload);
  }

  public async logout(refresh_token: string): Promise<void> {
    await this.tokenService.revokeRefreshToken(refresh_token);
  }

  private async generateAuthResponse(
    tokenPayload: CreateTokenDto,
  ): Promise<AuthResponseDto> {
    const [refresh_token, access_token] = await Promise.all([
      this.tokenService.generateRefreshToken(tokenPayload),
      this.tokenService.generateAccessToken(tokenPayload),
    ]);
    return {
      access_token: access_token,
      refresh_token: refresh_token,
      user: tokenPayload,
    };
  }

  private async validateUser(
    credentials: LoginCredentialsDto,
  ): Promise<CreateTokenDto> {
    const user = await this.userService.getByEmail(credentials.email);
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
