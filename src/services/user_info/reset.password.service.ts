import {BaseService} from "../base.service";
import {Logger} from "../../utils/logger";
import {MailService} from "../contact/mail.service";
import {ApiError} from "../../exceptions/api.error";
import bcrypt from "bcrypt";
import {inject, injectable} from "inversify";
import UserModel, {User} from "../../models/user/User";

@injectable()
export class ResetPasswordService extends BaseService {
    private mailService: MailService;

    public constructor(
        @inject(Logger) logger: Logger,
        @inject(MailService) mailService: MailService,
    ) {
        super(logger);
        this.mailService = mailService;
    }

    async changePasswordWithToken(token: string, newPassword: string) {
        const user = <User>await UserModel.findOne({passwordResetToken: token});
        if (!user) {
            throw ApiError.BadRequest("Invalid or expired token");
        }
        user.password = await this.hashPassword(newPassword);
        user.passwordResetToken = undefined;
        await user.save();
    }

    async changePasswordWithEmail(
        email: string,
        oldPassword: string,
        newPassword: string,
    ) {
        const user = <User>await UserModel.findOne({email});
        if (user) {
            const auth: boolean = await bcrypt.compare(oldPassword, user.password);
            if (auth) {
                user.password = await this.hashPassword(newPassword);
                await user.save();
                return;
            }
            await this.logger.logError(`Incorrect old password for email: ${email}`);
            throw ApiError.BadRequest("Incorrect old password");
        }
        await this.logger.logError(`User not found with email: ${email}`);
        throw ApiError.BadRequest("Incorrect contact");
    }

    async requestPasswordReset(email: string, token: string) {
        const user = <User>(
            await UserModel.findOneAndUpdate({email}, {passwordResetToken: token})
        );
        if (!user) {
            await this.logger.logError(`User not found with email: ${email}`);
            throw ApiError.BadRequest("Incorrect contact");
        }
        await this.mailService.sendResetPasswordMail(
            email,
            `${process.env.CLIENT_URL}/reset-password/${token}`,
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
