import * as express from "express";
import { inject } from "inversify";
import { controller, httpPost } from "inversify-express-utils";
import { multerMiddleware } from "../middlewares/malter.middleware";
import { AwsStorage } from "../storages/aws.storage";

@controller("/files")
export class FileController {
    private readonly awsStorage: AwsStorage;

    public constructor(@inject(AwsStorage) awsStorage: AwsStorage) {
        this.awsStorage = awsStorage;
    }

    @httpPost("/aws", multerMiddleware.any())
    public async uploadFilesWithAws(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const data = request.files as Express.Multer.File[];
            const files = await this.awsStorage.getUrlAndOriginalNames(data);
            response.status(200).json(files);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}
