import * as express from "express";
import { inject } from "inversify";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { FileService } from "../services/shop/image.service";
import { multerMiddleware } from "../middlewares/malter.middleware";
import { AwsStorage } from "../storages/aws.storage";

@controller("/files")
export class FileController {
    private readonly fileService: FileService;
    private readonly awsStorage: AwsStorage;

    public constructor(@inject(FileService) fileService: FileService, @inject(AwsStorage) awsStorage: AwsStorage) {
        this.fileService = fileService;
        this.awsStorage = awsStorage;
    }

    @httpGet("/cloudinary", multerMiddleware.any())
    public async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
        return await this.fileService.uploadImagesWithCloudinary(files);
    }

    @httpPost("/aws", multerMiddleware.any())
    public async uploadFilesWithAws(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const files = request.files as Express.Multer.File[];
            const url = await this.awsStorage.upload(files);
            response.status(200).json(url);
        } catch (error) {
            next(error);
        }
    }
}
