import * as express from "express";
import { TokenService } from "@services/token/token.service";
import { MailService } from "@services/contact/mail.service";
import { Controller, controller, httpPost } from "inversify-express-utils";
import { inject } from "inversify";

@controller("/contact")
export class ContactController implements Controller {
    private readonly mailService: MailService;
    private readonly tokenService: TokenService;

    public constructor(
        @inject(MailService) mailService: MailService,
        @inject(TokenService) tokenService: TokenService,
    ) {
        this.mailService = mailService;
        this.tokenService = tokenService;
    }

    @httpPost("/email")
    public async sendContactEmail(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        const { name, email, subject, message, token } = request.body;
        try {
            const userData = token
                ? this.tokenService.validateAccessToken(token)
                : null;
            const recipientEmail = email || userData?.email;
            if (recipientEmail) {
                await this.mailService.sendHtmlEmail(
                    "GLDCart Feedback",
                    process.env.FEEDBACK_EMAIL as string,
                    subject,
                    `My name is: ${name}. My email is: ${email}. ${message}`,
                );

                return response.json({
                    success: true,
                    message: "Email sent successfully",
                });
            }
            return response
                .status(400)
                .json({ success: false, message: "Error. Email was not sent" });
        } catch (error) {
            next(error);
        }
    }
}
