import * as express from "express";
import {
    BaseHttpController,
    controller,
    httpGet,
    httpPost,
} from "inversify-express-utils";
import { inject } from "inversify";
import { multerMiddleware } from "@middlewares/malter.middleware";
import { VerificationService } from "@services/verification/verification.service";

@controller("/verification")
export class VerificationController extends BaseHttpController {
    private readonly verificationService: VerificationService;

    public constructor(
        @inject(VerificationService) verificationService: VerificationService,
    ) {
        super();
        this.verificationService = verificationService;
    }

    @httpPost("/send-verification-email/:userId", multerMiddleware.any())
    public async sendVerificationEmail(
        request: express.Request,
    ): Promise<void> {
        const userId = request.params.userId;
        const files = request.files as Express.Multer.File[];

        await this.verificationService.sendVerificationEmail(userId, files);
        this.ok({ message: "Verification email sent" });
    }

    @httpGet("/verify-user/:token")
    public async verifyEmail(
        request: express.Request,
    ): Promise<void> {
        const token = request.params.token;

        await this.verificationService.verifyUser(token);
        this.ok({ message: "User verified" });
    }
}

