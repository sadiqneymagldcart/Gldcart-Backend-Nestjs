import Token, { IToken } from "../../models/Token";
import { Logger } from "../../utils/logger";
import { ITokens } from "../../types/ITokens";
import { JwtService } from "./jwtService";
import { BaseService } from "../baseService";
import { ITokenPayload } from "../../types/ITokenPayload";
import { inject, injectable } from "inversify";

@injectable()
export class TokenService extends BaseService {
    private jwtService: JwtService;
    constructor(
        @inject(JwtService) jwtService: JwtService,
        @inject(Logger) logger: Logger,
    ) {
        super(logger);
        this.jwtService = jwtService;
    }

    createTokens(payload: ITokenPayload): ITokens {
        return this.jwtService.createTokens(payload);
    }

    public async saveToken(
        userId: string,
        refreshToken: string,
    ): Promise<IToken> {
        const tokenData: IToken = <IToken>await Token.findOne({ user: userId });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        return await Token.create({ user: userId, refreshToken });
    }
    public async createAndSaveTokens(payload: ITokenPayload): Promise<IToken> {
        try {
            const { refreshToken } = this.jwtService.createTokens(payload);
            return this.saveToken(payload.id, refreshToken);
        } catch (error) {
            await this.logger.logError(`${error}`);
            throw error;
        }
    }

    public async removeToken(
        refreshToken: string,
    ): Promise<{ deletedCount?: number }> {
        return Token.deleteOne({ refreshToken });
    }

    public async findToken(refreshToken: string): Promise<IToken | null> {
        return Token.findOne({ refreshToken });
    }

    public async validateAccessToken(
        accessToken: string,
    ): Promise<ITokenPayload | null> {
        return this.jwtService.validateAccessToken(accessToken);
    }

    public validateRefreshToken(refreshToken: string): ITokenPayload | null {
        return this.jwtService.validateRefreshToken(refreshToken);
    }
}
