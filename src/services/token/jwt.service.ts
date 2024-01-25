import jwt from "jsonwebtoken";
import {BaseService} from "../base.service";
import {Logger} from "../../utils/logger";
import {inject, injectable} from "inversify";
import {ITokenPayload} from "../../interfaces/ITokenPayload";
import {ITokens} from "../../interfaces/ITokens";

@injectable()
export class JwtService extends BaseService {

    constructor(@inject(Logger) loggerService: Logger) {
        super(loggerService);
    }
    
    createTokens(payload: ITokenPayload): ITokens {
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

    validateAccessToken(accessToken: string): ITokenPayload | null {
        try {
            return jwt.verify(
                accessToken,
                process.env.JWT_ACCESS_SECRET!,
            ) as ITokenPayload;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(refreshToken: string): ITokenPayload | null {
        try {
            return jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET!,
            ) as ITokenPayload;
        } catch (e) {
            return null;
        }
    }
}
