import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { Nullable } from '@shared/types/common';
import { CreateTokenDto } from '@token/dto/create-tokens.dto';
import { ConfigService } from '@nestjs/config';
import { ITokenService } from '@token/interfaces/token.service.interface';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken } from '@token/schemas/token.schema';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';

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
    this.logger.debug(`Generated refresh token`);
    return await this._saveOrUpdateRefreshToken(payload._id, refreshToken);
  }

  public async revokeRefreshToken(refreshToken: string): Promise<void> {
    try {
      await this.tokenModel.deleteOne({ refresh_token: refreshToken });
      this.logger.debug(`Revoked refresh token: ${refreshToken}`);
    } catch (error) {
      this.logger.error('Failed to revoke refresh token', error.stack);
      throw new BadRequestException('Failed to revoke refresh token');
    }
  }

  public async verifyAccessToken(token: string): Promise<CreateTokenDto> {
    try {
      const payload = this.jwtService.verify(
        token,
        this.jwtAccessVerifyOptions,
      );
      this.logger.debug(
        `Access token verified for payload: ${JSON.stringify(payload)}`,
      );
      return plainToInstance(CreateTokenDto, payload);
    } catch (error) {
      this.logger.error('Failed to verify access token', error.stack);
      throw new BadRequestException('Invalid access token');
    }
  }

  public async verifyRefreshToken(
    refreshToken: string,
  ): Promise<CreateTokenDto> {
    this.logger.debug(`Verifying refresh token: ${refreshToken}`);

    const storedToken = await this._findRefreshToken(refreshToken);
    if (!storedToken) {
      this.logger.warn('Refresh token not found');
      throw new BadRequestException('Token not found');
    }
    try {
      const payload = this.jwtService.verify(
        refreshToken,
        this.jwtRefreshVerifyOptions,
      );
      this.logger.debug(
        `Refresh token verified for payload: ${JSON.stringify(payload)}`,
      );
      return plainToInstance(CreateTokenDto, payload);
    } catch (error) {
      this.logger.error('Failed to verify refresh token', error.stack);
      throw new BadRequestException('Invalid refresh token');
    }
  }

  private async _findRefreshToken(
    refreshToken: string,
  ): Promise<Nullable<RefreshToken>> {
    return this.tokenModel.findOne({ refresh_token: refreshToken }).exec();
  }

  private async _saveOrUpdateRefreshToken(
    userId: string,
    token: string,
  ): Promise<string> {
    let existingToken = await this.tokenModel.findOne({ user: { id: userId } });

    this.logger.debug('User has existing refresh token');

    if (existingToken) {
      existingToken.refresh_token = token;
      this.logger.debug(`Updating refresh token for user with id`);
    } else {
      this.logger.debug(`Creating refresh token for user with id`);
      existingToken = new this.tokenModel({
        user: { id: userId },
        refresh_token: token,
      });
    }
    await existingToken.save();
    this.logger.debug('Refresh token for user saved');
    return existingToken.refresh_token;
  }
}
