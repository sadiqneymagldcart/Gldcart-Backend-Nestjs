import { v4 as uuidv4 } from "uuid";
import { inject, injectable } from "inversify";
import { Logger } from "../../utils/logger";
import { MailService } from "../mail/mail.service";
import {UserModel} from "../../models/user/User";
import { ApiError } from "../../exceptions/api.error";
import { BaseService } from "../base/base.service";

@injectable()
export class VerificationService extends BaseService {
    private mailService: MailService;

    public constructor(
        @inject(Logger) logger: Logger,
        @inject(MailService) mailService: MailService,
    ) {
        super(logger);
        this.mailService = mailService;
    }

    public async sendVerificationEmail(
        userId: string,
        files: Express.Multer.File[],
    ) {
        const token: string = uuidv4();

        const attachments = files.map((file) => ({
            filename: file.originalname,
            content: file.buffer,
        }));

        const user = await UserModel.findByIdAndUpdate(userId, {
            verification_token: token,
        });

        if (!user) {
            throw ApiError.BadRequest("User not found");
        }
        await this.mailService.sendHtmlEmailWithAttachments(
            "User",
            process.env.FEEDBACK_EMAIL,
            "User's documents for verification",
            `<a href="http://localhost:3001/verification/verify-user/${token}">Click here to verify the user</a>`,
            attachments,
        );
    }

    public async verifyUser(token: string) {
        const user = await UserModel.findOne({ verification_token: token });
        if (!user) {
            throw ApiError.BadRequest("Invalid or expired token");
        }
        user.confirmed = true;
        user.verification_token = undefined;
        await user.save();
    }
}
