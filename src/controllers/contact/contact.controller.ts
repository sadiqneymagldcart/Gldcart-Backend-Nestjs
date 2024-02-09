import * as express from "express";
import {TokenService} from "../../services/token/token.service";
import {MailService} from "../../services/contact/mail.service";
import {controller, httpPost} from "inversify-express-utils";
import {inject} from "inversify";
import {requireAuth} from "../../middlewares/auth.middleware";

@controller("/")
export class ContactController {
    private readonly mailService: MailService;
    private readonly tokenService: TokenService;

    public constructor(@inject(MailService) mailService: MailService, @inject(TokenService) tokenService: TokenService) {
        this.mailService = mailService;
        this.tokenService = tokenService;
    }

    @httpPost("send-contact-email")
    public async sendContactEmail(request: express.Request, response: express.Response, next: express.NextFunction) {
        const {name, email, subject, message, token} = request.body;
        try {
            const userData = token ? await this.tokenService.validateAccessToken(token) : null;
            const recipientEmail = email || userData?.email;
            if (recipientEmail) {
                await this.mailService.sendContactMail(name, recipientEmail, subject, message);
                return response.json({success: true, message: "Email sent successfully"});
            }
            return response
                .status(400)
                .json({success: false, message: "Error. Email was not sent"});
        } catch (error) {
            next(error);
        }
    }
}
