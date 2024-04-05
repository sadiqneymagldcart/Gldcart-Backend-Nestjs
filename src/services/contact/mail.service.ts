import { Transporter } from "nodemailer";
import { ApiError } from "@exceptions/api.error";
import { Logger } from "@utils/logger";
import { inject, injectable } from "inversify";

@injectable()
export class MailService {
    private readonly transporter: Transporter;
    private readonly logger: Logger;

    public constructor(
        @inject(Logger) logger: Logger,
        @inject("NodemailerTransporter") transporter: Transporter,
    ) {
        this.logger = logger;
        this.transporter = transporter;
    }

    public async sendEmail(email: string, subject: string, message: string) {
        try {
            await this.transporter.sendMail({
                from: "GLDCart",
                to: email,
                subject: subject,
                text: message,
            });
            this.logger.logInfo(`Email was sent to ${email}`);
        } catch (error: any) {
            this.logger.logError("Failed to send email", error);
            throw ApiError.BadRequest("Failed to send email");
        }
    }

    public async sendHtmlEmail(
        from: string,
        to: string,
        subject: string,
        html: string,
    ) {
        try {
            await this.transporter.sendMail({
                from: from,
                to: to,
                subject: subject,
                html: html,
            });
            this.logger.logInfo(`Email was sent to ${to}`);
        } catch (error: any) {
            this.logger.logError("Failed to send email", error);
            throw ApiError.BadRequest("Failed to send email");
        }
    }

    public async sendHtmlEmailWithAttachments(
        from: string,
        to: string,
        subject: string,
        html: string,
        attachments: any,
    ) {
        try {
            await this.transporter.sendMail({
                from: from,
                to: to,
                subject: subject,
                html: html,
                attachments: attachments,
            });
            this.logger.logInfo(`Email was sent to ${to}`);
        } catch (error: any) {
            this.logger.logError("Failed to send email", error);
            throw ApiError.BadRequest("Failed to send email");
        }
    }

    // public async sendContactMail(
    //     name: string,
    //     email: string,
    //     subject: string,
    //     message: string,
    // ) {
    //     try {
    //         await this.transporter.sendMail({
    //             from: "GLDCart Feedback",
    //             to: process.env.FEEDBACK_EMAIL,
    //             subject: subject,
    //             text: `My name is: ${name}. My email is: ${email}. ${message}`,
    //         });
    //         this.logger.logInfo(`Email was sent to ${process.env.FEEDBACK_EMAIL}`);
    //     } catch (error: any) {
    //         console.log(error);
    //         this.logger.logError("Failed to send contact contact", error);
    //         throw ApiError.BadRequest("Failed to send contact");
    //     }
    // }

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
        this.logger.logInfo("Reset password contact was sent");
    }

    public async sendUserVerificationMail(
        userId: string,
        idNumber: string,
        files: Express.Multer.File[],
        verificationLink: string,
    ) {
        console.log(files);

        const attachments = files.map((file) => ({
            filename: file.originalname,
            content: file.buffer,
        }));

        await this.transporter.sendMail({
            from: "GLDCart",
            to: process.env.FEEDBACK_EMAIL,
            subject: "User Verification",
            html: `
            <p>Hello Admin,</p>
            <p>A user with ID: ${userId} has requested verification. ID number: ${idNumber}</p>
            <p>Please click <a href="${verificationLink}">here</a> to confirm the verification.</p>
            <p>Thank you!</p>
        `,
            attachments,
        });
    }
}
