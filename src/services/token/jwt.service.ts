import * as jwt from "jsonwebtoken";
import {BaseService} from "../base.service";
import {Logger} from "../../utils/logger";
import {inject, injectable} from "inversify";
import {ITokenPayload} from "../../interfaces/ITokenPayload";
import {ITokens} from "../../interfaces/ITokens";

@injectable()
export class JwtService extends BaseService {
    public constructor(@inject(Logger) loggerService: Logger) {
        super(loggerService);
    }

    public createTokens(payload: ITokenPayload): ITokens {
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

    public validateAccessToken(accessToken: string) {
        try {
            const decodedToken = jwt.verify(
                accessToken,
                process.env.JWT_REFRESH_SECRET!,
            ) as any;

            if (decodedToken && decodedToken._doc) {
                return decodedToken._doc;
            } else {
                return null;
            }
        } catch (e) {
            return null;
        }
    }

    public validateRefreshToken(refreshToken: string) {
        try {
            const decodedToken = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET!,
            ) as any;

            if (decodedToken && decodedToken._doc) {
                return decodedToken._doc;
            } else {
                return null;
            }
        } catch (e) {
            return null;
        }
    }
}
