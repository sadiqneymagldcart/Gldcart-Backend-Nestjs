import { BaseService } from "../base/base.service";
import { TokenService } from "../token/token.service";
import { Logger } from "../../utils/logger";
import { ApiError } from "../../exceptions/api.error";
import axios, { AxiosResponse } from "axios";
import * as qs from "qs";
import { Token } from "../../models/user/Token";
import { inject, injectable } from "inversify";
import { User, UserModel } from "../../models/user/User";
import { GoogleTokenResult } from "../../interfaces/GoogleTokenResult";
import { GoogleUserInfo } from "../../interfaces/GoogleUserInfo";
import { GoogleUserResult } from "../../interfaces/GoogleUserResult";
import { OAuthValues } from "../../interfaces/OAuthValues";

@injectable()
export class GoogleAuthService extends BaseService {
    private tokenService: TokenService;

    public constructor(
        @inject(Logger) logger: Logger,
        tokenService: TokenService,
    ) {
        super(logger);
        this.tokenService = tokenService;
    }

    public async loginGoogleUser(userInfo: GoogleUserInfo) {
        const user = await this.updateOrCreateGoogleUser(userInfo);
        return this.authenticateWithGoogle(user, userInfo.picture);
    }

    public async getGoogleOAuthTokens({
        code,
    }: {
        code: string;
    }): Promise<GoogleTokenResult | undefined> {
        const values = this.getOAuthValues(code);
        try {
            const googleResponse = await this.postToUrl(
                process.env.GOOGLE_TOKEN_URL,
                values,
            );
            return googleResponse.data;
        } catch (error: any) {
            await this.handleTokenError(error);
        }
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

    private async updateOrCreateGoogleUser(googleUserData: GoogleUserInfo) {
        let existingUser = await UserModel.findOne({ email: googleUserData.email });
        if (!existingUser)
            existingUser = await this.createGoogleUser(googleUserData);
        return existingUser;
    }

    private async createGoogleUser(googleUserData: GoogleUserInfo) {
        const firstName = googleUserData.name.split(" ")[0];

        const newUser = await UserModel.create({
            type: googleUserData.type,
            name: firstName,
            surname: googleUserData.surname,
            email: googleUserData.email,
            profile_picture: googleUserData.picture,
            password: googleUserData.password,
        });
        this.logger.logInfo(`New user created with email: ${googleUserData.email}`);
        return newUser;
    }

    private async authenticateWithGoogle(user: User, picture: string) {
        const userInfo = {
            id: user._id,
            type: user.type,
            name: user.name,
            surname: user.surname,
            email: user.email,
        };

        const tokens: Token = await this.tokenService.createAndSaveTokens(userInfo);
        this.logger.logInfo(`User logged in with Google: ${user.email}`);
        return { tokens, user: userInfo, picture: picture };
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

    private async handleTokenError(error: any): Promise<void> {
        this.logger.logError(
            "Failed to fetch Google OAuth Tokens",
            error.response?.data,
        );
        throw new ApiError(403, "Failed to fetch Google OAuth Tokens", error);
    }

    private async postToUrl(
        url: string,
        values: OAuthValues,
    ): Promise<AxiosResponse<GoogleTokenResult>> {
        return await axios.post<GoogleTokenResult>(url, qs.stringify(values), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
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
        this.logger.logError("Failed to fetch Google User", error.message);
        throw new Error(error.message);
    }
}
