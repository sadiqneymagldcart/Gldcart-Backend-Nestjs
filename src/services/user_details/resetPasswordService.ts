import {BaseService} from "../baseService";
import {Logger} from "../../utils/logger";
import {MailService} from "../mail/mailService";
import {ApiError} from "../../exceptions/api-error";
import User, {IUser} from "../../models/User";
import bcrypt from "bcrypt";

export class ResetPasswordService extends BaseService {
    private mailService: MailService;

    constructor(logger: Logger, mailService: MailService) {
        super(logger);
        this.mailService = mailService;
    }

    async changePasswordWithToken(token: string, newPassword: string) {
        const user = <IUser>await User.findOne({passwordResetToken: token});
        if (!user) {
            throw ApiError.BadRequest("Invalid or expired token");
        }
        user.password = await this.hashPassword(newPassword);
        user.passwordResetToken = undefined;
        await user.save();
    }

    async changePasswordWithEmail(email: string, oldPassword: string, newPassword: string) {
        const user = <IUser>await User.findOne({email});
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
        throw ApiError.BadRequest("Incorrect mail");
    }

    async requestPasswordReset(email: string, token: string) {
        const user = <IUser>(
            await User.findOneAndUpdate({email}, {passwordResetToken: token})
        );
        if (!user) {
            await this.logger.logError(`User not found with email: ${email}`);
            throw ApiError.BadRequest("Incorrect mail");
        }
        await this.mailService.sendResetPasswordMail(
            email,
            `${process.env.CLIENT_URL}/reset-password/${token}`
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