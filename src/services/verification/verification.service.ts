import { v4 as uuidv4 } from "uuid";
import { inject, injectable } from "inversify";
import { Logger } from "@utils/logger";
import { MailService } from "../contact/mail.service";
import { BaseService } from "../base/base.service";
import { BadRequestException } from "@exceptions/bad-request.exception";
import { UserService } from "@services/user/user.service";

@injectable()
export class VerificationService extends BaseService {
    private readonly mailService: MailService;
    private readonly userService: UserService;

    public constructor(
        @inject(Logger) logger: Logger,
        @inject(MailService) mailService: MailService,
        @inject(UserService) userService: UserService,
    ) {
        super(logger);
        this.mailService = mailService;
        this.userService = userService;
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

        const user = await this.userService.getUserByIdAndUpdate(userId, {
            verification_token: token,
        });

        if (!user) {
            throw new BadRequestException("User not found");
        }
        await this.mailService.sendHtmlEmailWithAttachments(
            "User",
            process.env.FEEDBACK_EMAIL as string,
            "User's documents for verification",
            `<a href="http://localhost:3001/verification/verify-user/${token}">Click here to verify the user</a>`,
            attachments,
        );
    }

    public async verifyUser(token: string) {
        const user = await this.userService.getUserByData({
            verification_token: token,
        });

        if (!user) throw new BadRequestException("Invalid token");

        user.confirmed = true;
        user.verification_token = undefined;
        await user.save();
    }
}
