import * as express from "express";
import { TokenService } from "@services/token/token.service";
import { MailService } from "@services/contact/mail.service";
import { BaseHttpController, controller, httpPost } from "inversify-express-utils";
import { inject } from "inversify";

@controller("/contact")
export class ContactController extends BaseHttpController {
    private readonly mailService: MailService;
    private readonly tokenService: TokenService;

    public constructor(
        @inject(MailService) mailService: MailService,
        @inject(TokenService) tokenService: TokenService,
    ) {
        super();
        this.mailService = mailService;
        this.tokenService = tokenService;
    }

    @httpPost("/email")
    public async sendContactEmail(
        request: express.Request,
    ) {
        const { name, email, subject, message, token } = request.body;
        const userData = token ? this.tokenService.validateAccessToken(token) : null;
        const recipientEmail = email || userData?.email;
        if (recipientEmail) {
            await this.mailService.sendHtmlEmail(
                "GLDCart Feedback",
                process.env.FEEDBACK_EMAIL as string,
                subject,
                `My name is: ${name}. My email is: ${email}. ${message}`,
            );

            return this.json({
                success: true,
                message: "Email sent successfully",
            });
        }
        return this.json({ success: false, message: "Error. Email was not sent" }, 400);
    }
}

