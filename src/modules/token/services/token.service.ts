import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { Nullable } from '@shared/types/common';
import { CreateTokenDto } from '@token/dto/create-token.dto';
import { ITokenService } from '@token/interfaces/token.service.interface';
import { RefreshToken } from '@token/schemas/token.schema';

@Injectable()
export class TokenService implements ITokenService {
  private readonly jwtAccessOptions: JwtSignOptions;
  private readonly jwtRefreshOptions: JwtSignOptions;
  private readonly jwtAccessVerifyOptions: JwtVerifyOptions;
  private readonly jwtRefreshVerifyOptions: JwtVerifyOptions;
  private readonly logger: Logger = new Logger(TokenService.name);

  public constructor(
    private readonly jwtService: JwtService,
    @InjectModel(RefreshToken.name)
    private readonly tokenModel: Model<RefreshToken>,
    private readonly configService: ConfigService,
  ) {
    this.jwtAccessOptions = {
      secret: this.configService.get<string>('ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('ACCESS_EXPIRATION_TIME'),
    };
    this.jwtRefreshOptions = {
      secret: this.configService.get<string>('REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_EXPIRATION_TIME'),
    };
    this.jwtAccessVerifyOptions = {
      secret: this.configService.get<string>('ACCESS_SECRET'),
    };
    this.jwtRefreshVerifyOptions = {
      secret: this.configService.get<string>('REFRESH_SECRET'),
    };
  }

  public async generateAccessToken(payload: CreateTokenDto): Promise<string> {
    return this.jwtService.sign({ ...payload }, this.jwtAccessOptions);
  }

  public async generateRefreshToken(payload: CreateTokenDto): Promise<string> {
    const refreshToken = this.jwtService.sign(
      { ...payload },
      this.jwtRefreshOptions,
    );
    return this.saveOrUpdateRefreshToken(payload._id, refreshToken);
  }

  public async revokeRefreshToken(refreshToken: string): Promise<void> {
    try {
      await this.tokenModel.deleteOne({ refresh_token: refreshToken });
    } catch (error) {
      throw new BadRequestException('Failed to revoke refresh token');
    }
  }

  public async verifyAccessToken(token: string): Promise<CreateTokenDto> {
    try {
      const payload = this.jwtService.verify(
        token,
        this.jwtAccessVerifyOptions,
      );

      return plainToInstance(CreateTokenDto, payload);
    } catch (error) {
      throw new BadRequestException('Invalid access token');
    }
  }

  public async verifyRefreshToken(
    refreshToken: string,
  ): Promise<CreateTokenDto> {
    const storedToken = await this.findRefreshToken(refreshToken);
    if (!storedToken) {
      this.logger.warn('Refresh token not found');
      throw new BadRequestException('Token not found');
    }
    try {
      const payload = this.jwtService.verify(
        refreshToken,
        this.jwtRefreshVerifyOptions,
      );
      return plainToInstance(CreateTokenDto, payload);
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  }

  private async findRefreshToken(
    refreshToken: string,
  ): Promise<Nullable<RefreshToken>> {
    return this.tokenModel.findOne({ refresh_token: refreshToken });
  }

  private async saveOrUpdateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<string> {
    this.logger.debug(`Saving or updating refresh token for user: ${userId}`);

    let existingToken = await this.tokenModel.findOne({
      user: userId,
    });

    if (existingToken) {
      this.logger.debug(`Existing token found for user: ${userId}`);
      existingToken.refresh_token = refreshToken;
    } else {
      this.logger.debug(
        `No existing token found for user: ${userId}, creating new token`,
      );
      existingToken = new this.tokenModel({
        user: userId,
        refresh_token: refreshToken,
      });
    }

    await existingToken.save();
    this.logger.debug(`Refresh token saved for user: ${userId}`);
    return existingToken.refresh_token;
  }
}
