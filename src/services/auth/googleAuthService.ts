import { BaseService } from "../baseService";
import { TokenService } from "../token/tokenService";
import { Logger } from "../../utils/logger";
import { ApiError } from "../../exceptions/api-error";
import { GoogleTokensResult } from "../../types/googleAuth/googleTokensResult";
import { GoogleUserResult } from "../../types/googleAuth/googleUserResult";
import { GoogleUserInfo } from "../../types/googleAuth/googleUserInfo";
import { OAuthValues } from "../../types/googleAuth/OAuthValues";
import { ITokenPayload } from "../../types/ITokenPayload";
import User, { IUser } from "../../models/User";
import axios, { AxiosResponse } from "axios";
import qs from "qs";
import { IToken } from "../../models/Token";
import { inject, injectable } from "inversify";

@injectable()
export class GoogleAuthService extends BaseService {
    private tokenService: TokenService;

    constructor(@inject(Logger) logger: Logger, tokenService: TokenService) {
        super(logger);
        this.tokenService = tokenService;
    }

    public async loginGoogleUser(userInfo: GoogleUserInfo) {
        const user = await this.updateOrCreateGoogleUser(userInfo);
        return this.authenticateWithGoogle(user, userInfo.picture);
    }

    private async updateOrCreateGoogleUser({
        type,
        name,
        surname,
        email,
        picture,
        password,
    }: GoogleUserInfo) {
        let existingUser = await User.findOne({ email: email });
        if (!existingUser)
            existingUser = await this.createGoogleUser({
                type,
                name,
                surname,
                email,
                picture,
                password,
            } as GoogleUserInfo);
        return existingUser;
    }

    private async createGoogleUser({
        type,
        name,
        surname,
        email,
        picture,
        password,
    }: GoogleUserInfo): Promise<IUser> {
        const firstName = name.split(" ")[0];
        const newUser = <IUser>await User.create({
            type: type,
            name: firstName,
            surname: surname,
            email: email,
            picture: picture,
            password: password,
        });
        await this.logger.logInfo(`New user created with email: ${email}`);
        return newUser;
    }

    private async authenticateWithGoogle(user: IUser, picture: string) {
        const tokens: IToken = await this.tokenService.createAndSaveTokens({
            id: user._id,
            type: user.type,
            name: user.name,
            surname: user.surname,
            email: user.email,
        } as ITokenPayload);
        await this.logger.logInfo(`User logged in with Google: ${user.email}`);
        return { ...tokens, user: user, picture: picture };
    }

    public async getGoogleOAuthTokens({
        code,
    }: {
        code: string;
    }): Promise<GoogleTokensResult | undefined> {
        const values = this.getOAuthValues(code);
        try {
            const res: AxiosResponse<GoogleTokensResult> = await this.postToUrl(
                process.env.GOOGLE_TOKEN_URL!,
                values,
            );
            return res.data;
        } catch (error: any) {
            await this.handleTokenError(error);
        }
    }

    private getOAuthValues(code: string): OAuthValues {
        return {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
            grant_type: "authorization_code",
        };
    }

    private async postToUrl(
        url: string,
        values: OAuthValues,
    ): Promise<AxiosResponse<GoogleTokensResult>> {
        return await axios.post<GoogleTokensResult>(url, qs.stringify(values), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
    }

    private async handleTokenError(error: any): Promise<void> {
        await this.logger.logError(
            "Failed to fetch Google OAuth Tokens",
            error.response?.data,
        );
        throw new ApiError(403, "Failed to fetch Google OAuth Tokens", error);
    }

    public async getGoogleUser(
        id_token: string,
        access_token: string,
    ): Promise<GoogleUserResult | undefined> {
        try {
            const res = await this.getGoogleUserInfo(id_token, access_token);
            return res.data;
        } catch (error: any) {
            await this.handleUserInfoError(error);
        }
    }

    private async getGoogleUserInfo(id_token: string, access_token: string) {
        return await axios.get<GoogleUserResult>(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
            {
                headers: { Authorization: `Bearer ${id_token}` },
            },
        );
    }

    private async handleUserInfoError(error: any) {
        await this.logger.logError("Failed to fetch Google User", error.message);
        throw new Error(error.message);
    }
}
