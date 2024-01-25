import {Transporter} from "nodemailer";
import {ApiError} from "../../exceptions/api.error";
import {Logger} from "../../utils/logger";
import {inject, injectable} from "inversify";

@injectable()
export class MailService {
    private transporter: Transporter;
    private logger: Logger;

    constructor(
        @inject(Logger) logger: Logger,
        @inject("NodemailerTransporter") transporter: Transporter,
    ) {
        this.logger = logger;
        this.transporter = transporter;
    }

    public async sendContactMail(
        name: string,
        email: string,
        subject: string,
        message: string,
    ) {
        try {
            await this.transporter.sendMail({
                from: "GLDCart Feedback",
                to: process.env.FEEDBACK_EMAIL,
                subject: subject,
                text: `My name is: ${name}. My email is: ${email}. ${message}`,
            });
            await this.logger.logInfo(
                `Email was sent to ${process.env.FEEDBACK_EMAIL}`,
            );
        } catch (error: any) {
            await this.logger.logError("Failed to send contact contact", error);
            throw ApiError.BadRequest("Failed to send contact");
        }
    }

    public async sendResetPasswordMail(email: string, link: string) {
        await this.transporter.sendMail({
            from: "GLDCart",
            to: email,
            subject: "Password reset on GLDCart.com",
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
           </html>
`,
        });
        await this.logger.logInfo("Reset password contact was sent");
    }
}
