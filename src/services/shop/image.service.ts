import { inject, injectable } from "inversify";
import { BaseService } from "../base.service";
import { uploadToCloudinary } from "../../utils/cloudinary.util";
import { Logger } from "../../utils/logger";

@injectable()
export class ImageService extends BaseService {
    public constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }

    public async uploadImages(files: Express.Multer.File[]): Promise<string[]> {
        return await Promise.all(
            files.map(async (file) => {
                const result = await uploadToCloudinary(file);
                console.log(result.url);
                return result.url;
            }),
        );
    }
}
