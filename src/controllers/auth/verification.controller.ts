import * as express from "express";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import { multerMiddleware } from "../../middlewares/malter.middleware";
import { requireAuth } from "../../middlewares/auth.middleware";
import { VerificationService } from "../../services/auth/verification.service";

@controller("/verification")
export class VerificationController {
    private readonly verificationService: VerificationService;

    public constructor(
        @inject(VerificationService) verificationService: VerificationService,
    ) {
        this.verificationService = verificationService;
    }

    @httpPost("/send-verification-email/:userId", multerMiddleware.any())
    public async sendVerificationEmail(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const userId = request.params.userId;
            const files = request.files as Express.Multer.File[];
            await this.verificationService.sendVerificationEmail(userId, files);
            response.status(200).json({ message: "Verification email sent" });
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/verify-user/:token")
    public async verifyEmail(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const token = request.params.token;
            await this.verificationService.verifyUser(token);
            response.status(200).json({ message: "User verified" });
        } catch (error) {
            next(error);
        }
    }
}
