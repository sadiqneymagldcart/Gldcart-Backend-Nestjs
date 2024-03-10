import * as jwt from "jsonwebtoken";
import TokenModel, { Token } from "../../models/user/Token";
import { Logger } from "../../utils/logger";
import { BaseService } from "../base/base.service";
import { inject, injectable } from "inversify";
import { TokenPayload } from "../../interfaces/TokenPayload";
import { Tokens } from "../../interfaces/Tokens";

@injectable()
export class TokenService extends BaseService {
    public constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }

    createTokens(payload: TokenPayload): Tokens {
        const accessToken: string = jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET!,
            {
                expiresIn: "15m",
            },
        );
        const refreshToken: string = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET!,
            {
                expiresIn: "30d",
            },
        );
        return { accessToken, refreshToken };
    }

    public async saveToken(userId: string, refreshToken: string): Promise<Token> {
        const tokenData = <Token>await TokenModel.findOne({ user: userId });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        return await TokenModel.create({ user: userId, refreshToken });
    }

    public async createAndSaveTokens(payload: TokenPayload): Promise<Token> {
        try {
            const { refreshToken } = this.createTokens(payload);
            console.log(refreshToken);
            return this.saveToken(payload.id, refreshToken);
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

    public async findToken(refreshToken: string): Promise<Token | null> {
        return TokenModel.findOne({ refreshToken });
    }

    public async validateAccessToken(accessToken: string) {
        try {
            return jwt.verify(accessToken, process.env.JWT_REFRESH_SECRET!) as any;
        } catch (e) {
            return null;
        }
    }

    public validateRefreshToken(refreshToken: string) {
        try {
            return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
        } catch (e) {
            return null;
        }
    }
}
