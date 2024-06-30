import * as express from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpPost } from "inversify-express-utils";
import { AwsStorage } from "@storages/aws.storage";
import { multerMiddleware } from "@src/middlewares/malter.middleware";

@controller("/files")
export class FileController extends BaseHttpController {
    private readonly awsStorage: AwsStorage;

    public constructor(@inject(AwsStorage) awsStorage: AwsStorage) {
        super();
        this.awsStorage = awsStorage;
    }

    @httpPost("/aws", multerMiddleware.any())
    public async uploadFilesWithAws(request: express.Request) {
        const data = request.files as Express.Multer.File[];
        const files = await this.awsStorage.getUrlAndOriginalNames(data);
        return this.json(files);
    }
}

