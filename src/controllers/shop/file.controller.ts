import * as express from "express";
import { controller, httpPost } from "inversify-express-utils";
import { multerMiddleware } from "../../middlewares/malter.middleware";
import { uploadToCloudinary } from "../../utils/cloudinary.util";

@controller("/image")
export class FileController {
    public constructor() { }

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
            next(error);
        }
    }

    @httpPost("")
    public async() { }
}
