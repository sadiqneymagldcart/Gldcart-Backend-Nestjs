import * as express from "express";
import { v4 as uuidv4 } from "uuid";
import {
    BaseHttpController,
    controller,
    httpPost,
} from "inversify-express-utils";
import { inject } from "inversify";
import { PasswordService } from "@services/personal/reset-password.service";

@controller("/password")
export class PasswordController extends BaseHttpController {
    private readonly passwordResetService: PasswordService;

    public constructor(
        @inject(PasswordService) passwordResetService: PasswordService,
    ) {
        super();
        this.passwordResetService = passwordResetService;
    }

    @httpPost("/initiate")
    async initiatePasswordReset(request: express.Request) {
        const email = request.body.email;
        const token: string = uuidv4();
        await this.passwordResetService.requestPasswordReset(email, token);
        return this.ok({
            message: "Password reset link was sent to your contact.",
        });
    }

    @httpPost("/reset/:token")
    public async resetPasswordWithToken(request: express.Request) {
        const token = request.params.token;
        const newPassword = request.body.newPassword;
        await this.passwordResetService.changePasswordWithToken(token, newPassword);
        return this.ok({ message: "Password was reset successfully." });
    }

    @httpPost("/reset")
    public async resetPasswordWithEmail(request: express.Request) {
        const { email, oldPassword, newPassword } = request.body;
        await this.passwordResetService.changePasswordWithEmail(
            email,
            oldPassword,
            newPassword,
        );
        return this.ok({ message: "Password was reset successfully." });
    }
}
