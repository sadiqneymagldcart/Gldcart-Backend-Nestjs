import * as express from "express";
import { GoogleAuthService } from "@services/auth/google-auth.service";
import { inject } from "inversify";
import {
    BaseHttpController,
    controller,
    httpGet,
} from "inversify-express-utils";
import { setRefreshTokenCookie } from "@utils/token.utils";
import { IGoogleUserResult } from "@interfaces/IGoogleUserResult";
import { IGoogleUserInfo } from "@interfaces/IGoogleUserInfo";
import { Nullable } from "@src/ts/types/nullable";

@controller("/tokens/oauth/google")
export class GoogleAuthController extends BaseHttpController {
    private readonly googleAuthService: GoogleAuthService;
    private readonly googlePassword = process.env.GOOGLE_PASSWORD!;

    public constructor(
        @inject(GoogleAuthService) googleAuthService: GoogleAuthService,
    ) {
        super();
        this.googleAuthService = googleAuthService;
    }

    @httpGet("/")
    public async googleAuthWebhook(
        request: express.Request,
        response: express.Response,
    ) {
        const code = request.query.code as string;
        const customParameter = request.query.state as string;

        const oAuthTokens = await this.googleAuthService.getGoogleOAuthTokens({
            code,
        });
        if (oAuthTokens == null) {
            return response.status(400).send("Invalid OAuth Tokens");
        }

        const googleUser = (await this.googleAuthService.getGoogleUser(
            oAuthTokens.id_token,
            oAuthTokens.access_token,
        )) as IGoogleUserResult;

        this.validateGoogleUser(googleUser, response);

        const userInfo: IGoogleUserInfo = {
            code: code,
            type: customParameter,
            name: googleUser.given_name,
            surname: googleUser.family_name,
            email: googleUser.email,
            picture: googleUser.picture,
            password: this.googlePassword,
        };

        const result = await this.googleAuthService.loginGoogleUser(userInfo);

        if (!result.tokens) {
            return response.status(401).send("Unauthorized");
        }

        setRefreshTokenCookie(response, result.tokens.refreshToken);
        const redirectURL = `${process.env.CLIENT_URL}` as string;
        response.redirect(redirectURL);
    }

    private validateGoogleUser(
        googleUser: Nullable<IGoogleUserResult>,
        response: express.Response,
    ) {
        if (!googleUser) {
            response.status(404).send("Google User was not found");
            return;
        }
        if (!googleUser.verified_email) {
            response.status(403).send("Google account is not verified");
            return;
        }
    }
}
