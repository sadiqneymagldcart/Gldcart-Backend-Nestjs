import * as express from "express";
import { inject } from "inversify";
import { controller, httpGet } from "inversify-express-utils";
import { FileService } from "../services/shop/image.service";
import { multerMiddleware } from "../middlewares/malter.middleware";

@controller("/files")
export class FileController {
    private readonly imageService: FileService;
    public constructor(@inject(FileService) imageService: FileService) {
        this.imageService = imageService;
    }

    @httpGet("/", multerMiddleware.any())
    public async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
        return await this.imageService.uploadImagesWithCloudinary(files);
    }

    @httpGet("/aws", multerMiddleware.any())
    public async uploadFilesWithAws(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const files = request.files as Express.Multer.File[];
            const url = await this.imageService.uploadImagesWithAws(files);
            response.status(200).json(url);
        } catch (error) {
            next(error);
        }
    }
}
