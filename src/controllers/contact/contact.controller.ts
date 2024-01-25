import {TokenService} from "../../services/token/token.service";
import {NextFunction, Request, Response} from "express";
import {MailService} from "../../services/contact/mail.service";

export class ContactController
{
    private mailService: MailService;
    private tokenService: TokenService;

    constructor(mailService: MailService, tokenService: TokenService) {
        this.mailService = mailService; 
        this.tokenService = tokenService; 
    }

    async sendContactEmail (request: Request, response: Response, next: NextFunction) {
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
