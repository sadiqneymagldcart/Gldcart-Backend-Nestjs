import * as express from "express";
import { controller, httpPost } from "inversify-express-utils";
import { multerMiddleware } from "../../middlewares/malter.middleware";
import { uploadToCloudinary } from "../../utils/cloudinary.util";
import { inject } from "inversify";
import { IStorage } from "../../interfaces/Storage";

@controller("/image")
export class FileController {
    private readonly storage: IStorage;
    public constructor(@inject(IStorage) storage: IStorage) {
        this.storage = storage;
    }

    @httpPost("/", multerMiddleware.array("images", 2))
    public async uploadImageWithCloudinary(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const files = req.files as Express.Multer.File[];

            const uploadPromises = files.map(async (file) => {
                const result = await uploadToCloudinary(file);
                console.log(result.url);
            });

            await Promise.all(uploadPromises);

            res.status(200).json({ message: "Images uploaded successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    @httpPost("")
    public async() { }
}
