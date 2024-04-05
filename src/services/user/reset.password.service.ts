import { BaseService } from "../base/base.service";
import { Logger } from "../../utils/logger";
import { MailService } from "../contact/mail.service";
import { ApiError } from "../../exceptions/api.error";
import * as bcrypt from "bcrypt";
import { inject, injectable } from "inversify";
import { User, UserModel } from "../../models/user/User";

@injectable()
export class PasswordService extends BaseService {
    private readonly mailService: MailService;

    public constructor(
        @inject(Logger) logger: Logger,
        @inject(MailService) mailService: MailService,
    ) {
        super(logger);
        this.mailService = mailService;
    }

    public async changePasswordWithToken(token: string, newPassword: string) {
        const user = <User>await UserModel.findOne({ passwordResetToken: token });
        if (!user) {
            throw ApiError.BadRequest("Invalid or expired token");
        }
        user.password = await this.hashPassword(newPassword);
        user.passwordResetToken = undefined;
        await user.save();
    }

    public async changePasswordWithEmail(
        email: string,
        oldPassword: string,
        newPassword: string,
    ) {
        const user = <User>await UserModel.findOne({ email });
        if (user) {
            const auth: boolean = await bcrypt.compare(oldPassword, user.password);
            if (auth) {
                user.password = await this.hashPassword(newPassword);
                await user.save();
                return;
            }
            this.logger.logError(`Incorrect old password for email: ${email}`);
            throw ApiError.BadRequest("Incorrect old password");
        }
        this.logger.logError(`User not found with email: ${email}`);
        throw ApiError.BadRequest("Incorrect contact");
    }

    public async requestPasswordReset(email: string, token: string) {
        const user = <User>(
            await UserModel.findOneAndUpdate({ email }, { passwordResetToken: token })
        );
        if (!user) {
            this.logger.logError(`User not found with email: ${email}`);
            throw ApiError.BadRequest("Incorrect contact");
        }

        const link = `${process.env.CLIENT_URL}/password/${token}`;
        const data = {
            from: "GLDCart",
            to: email,
            subject: "Password Reset",
            html: `<!DOCTYPE html>
           <html lang="en">
           <head>
           <meta charset="UTF-8">
           <title>Password Reset</title>
           </head>
           <body>
           <p>Hello,</p>
           <p>You have requested to reset your password. To reset your password, please click on the following link:</p>
           <p><a href="${link}">Reset Password</a></p>
           <p>If you did not request a password reset, please ignore this email.</p>
           <p>Thank you!</p>
           </body>
           </html>`,
        };
        await this.mailService.sendHtmlEmail(
            data.from,
            data.to,
            data.subject,
            data.html,
        );
    }

    private async hashPassword(password: string): Promise<string> {
        try {
            const salt: string = await bcrypt.genSalt();
            return await bcrypt.hash(password, salt);
        } catch (error) {
            throw error;
        }
    }
}
