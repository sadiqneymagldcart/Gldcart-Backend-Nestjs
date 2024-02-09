import * as express from "express";
import { v4 as uuidv4 } from "uuid";
import { controller, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import { PasswordService } from "../../services/user_info/reset.password.service";

@controller("/password")
export class PasswordController {
    private readonly passwordResetService: PasswordService;

    public constructor(
        @inject(PasswordService) passwordResetService: PasswordService,
    ) {
        this.passwordResetService = passwordResetService;
    }

    @httpPost("/initiate")
    async initiatePasswordReset(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        const email = request.body.email;
        try {
            const token: string = uuidv4();
            await this.passwordResetService.requestPasswordReset(email, token);
            response
                .status(200)
                .json({ message: "Password reset link was sent to your contact." });
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/reset/:token")
    public async resetPasswordWithToken(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        const token = request.params.token;
        const newPassword = request.body.newPassword;
        try {
            await this.passwordResetService.changePasswordWithToken(
                token,
                newPassword,
            );
            response
                .status(200)
                .json({ message: "Password was reset successfully." });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    @httpPost("/reset")
    public async resetPasswordWithEmail(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        const { email, oldPassword, newPassword } = request.body;
        try {
            await this.passwordResetService.changePasswordWithEmail(
                email,
                oldPassword,
                newPassword,
            );
            response
                .status(200)
                .json({ message: "Password was reset successfully." });
        } catch (error) {
            next(error);
        }
    }
}
