import * as jwt from "jsonwebtoken";
import TokenModel, { Token } from "../../models/token/Token";
import { Logger } from "@utils/logger";
import { BaseService } from "../base/base.service";
import { inject, injectable } from "inversify";
import { ITokenPayload } from "@interfaces/ITokenPayload";
import { ITokens } from "@interfaces/ITokens";
import { Nullable } from "@ts/types/nullable";

@injectable()
export class TokenService extends BaseService {
    private readonly jwtAccessSecret: string = process.env.JWT_ACCESS_SECRET!;
    private readonly jwtRefreshSecret: string = process.env.JWT_REFRESH_SECRET!;

    private readonly jwtAccessExpiration: string = "15m";
    private readonly jwtRefreshExpiration: string = "30d";

    public constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }

    public createTokens(payload: ITokenPayload): ITokens {
        const accessToken: string = jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET!,
            {
                expiresIn: this.jwtAccessExpiration,
            },
        );
        const refreshToken: string = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET!,
            {
                expiresIn: this.jwtRefreshExpiration,
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

    public async createAndSaveTokens(payload: ITokenPayload): Promise<Token> {
        try {
            const { refreshToken } = this.createTokens(payload);
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

    public async findToken(refreshToken: string): Promise<Nullable<Token>> {
        return TokenModel.findOne({ refreshToken });
    }

    public validateAccessToken(accessToken: string): Nullable<ITokenPayload> {
        return <any>jwt.verify(accessToken, this.jwtAccessSecret);
    }

    public validateRefreshToken(refreshToken: string): Nullable<ITokenPayload> {
        return <any>jwt.verify(refreshToken, this.jwtRefreshSecret);
    }
}
