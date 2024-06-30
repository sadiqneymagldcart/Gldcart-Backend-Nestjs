import {Request, Response} from "express";
import {GoogleAuthService} from "../../services/auth/googleAuthService";
import {GoogleUserInfo} from "../../types/googleAuth/googleUserInfo";
import {inject, injectable} from "inversify";
import { httpGet } from "inversify-express-utils";

@injectable()
export class GoogleAuthController {
    private googleAuthService: GoogleAuthService;

    constructor(@inject(GoogleAuthService) googleAuthService: GoogleAuthService) {
        this.googleAuthService = googleAuthService;
    }


    @httpGet('/google')
    public async googleOauthHandler(request: Request, response: Response) {
        try {
            const {code} = request.body;
            const customParameter = request.query.state as string;
            const oAuthTokens = await this.googleAuthService.getGoogleOAuthTokens({code});
            if (oAuthTokens == null) {
                return;
            }

            const googleUser = await this.googleAuthService.getGoogleUser(oAuthTokens.id_token, oAuthTokens.access_token);
            if (!googleUser) {
                response.status(404).send("Google User was not found");
                return;
            }
            if (!googleUser.verified_email) {
                response.status(403).send("Google account is not verified");
                return;
            }
            const userInfo: GoogleUserInfo = {
                code: code,
                type: customParameter,
                name: googleUser.given_name,
                surname: googleUser.family_name,
                email: googleUser.email,
                picture: googleUser.picture,
                password: 'gldcart123',
            };
            const result = await this.googleAuthService.loginGoogleUser(userInfo);
            response.status(200).json(result);
        } catch (error) {
            response.status(500).json({message: 'Error processing OAuth callback.'});
        }
    }
}
