import * as jwt from "jsonwebtoken";
import TokenModel, { Token } from "../../models/token/Token";
import { Logger } from "@utils/logger";
import { inject, injectable } from "inversify";
import { Nullable } from "@ts/types/nullable";
import { LoginRequestDto } from "@src/dto/login.request.dto";

@injectable()
export class TokenService {
    private readonly jwtAccessSecret: string = process.env.JWT_ACCESS_SECRET!;
    private readonly jwtRefreshSecret: string = process.env.JWT_REFRESH_SECRET!;

    private readonly jwtAccessExpiration: string = "15m";
    private readonly jwtRefreshExpiration: string = "30d";

    public constructor(@inject(Logger) private readonly logger: Logger) { }

    public async createAccessToken(payload: LoginRequestDto): Promise<string> {
        return jwt.sign(payload, this.jwtAccessSecret, {
            expiresIn: this.jwtAccessExpiration,
        });
    }

    public async createRefreshToken(payload: LoginRequestDto): Promise<string> {
        return jwt.sign(payload, this.jwtRefreshSecret, {
            expiresIn: this.jwtRefreshExpiration,
        });
    }

    public async saveRefreshToken(
        userId: string,
        refreshToken: string,
    ): Promise<Token> {
        const tokenData = await TokenModel.findOne({ user: userId });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        return await TokenModel.create({ user: userId, refreshToken });
    }

    public async createAndSaveTokens(payload: LoginRequestDto): Promise<Token> {
        try {
            const refreshToken = await this.createRefreshToken(payload);
            return this.saveRefreshToken(payload.id, refreshToken);
        } catch (error) {
            this.logger.logError(`${error}`);
            throw error;
        }
    }

    public async removeToken(
        refreshToken: string,
    ): Promise<{ deletedCount?: number }> {
        return TokenModel.deleteOne({ refreshToken });
    }

    private async findToken(refreshToken: string): Promise<string> {
        const token = await TokenModel.findOne({ refreshToken });

        if (!token) {
            throw new Error("Token not found");
        }

        return token.refreshToken;
    }

    public validateAccessToken(accessToken: string): Nullable<LoginRequestDto> {
        return <LoginRequestDto>jwt.verify(accessToken, this.jwtAccessSecret);
    }

    public async validateRefreshToken(
        refreshToken: string,
    ): Promise<LoginRequestDto> {
        const tokenFromDb = await this.findToken(refreshToken);
        return <LoginRequestDto>jwt.verify(tokenFromDb, this.jwtRefreshSecret);
    }
}
