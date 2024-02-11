import * as express from "express";
import { inject } from "inversify";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { RentingService } from "../../services/shop/renting.service";
import { multerMiddleware } from "../../middlewares/malter.middleware";
import { requireAuth } from "../../middlewares/auth.middleware";
import { ImageService } from "../../services/shop/image.service";
import { Renting } from "../../models/shop/product/Renting";

@controller("/renting")
export class RentingController {
    private readonly imageService: ImageService;
    private readonly rentingService: RentingService;
    public constructor(
        @inject(RentingService) rentingService: RentingService,
        @inject(ImageService) imageService: ImageService,
    ) {
        this.rentingService = rentingService;
        this.imageService = imageService;
    }

    @httpPost("/", multerMiddleware.any(), requireAuth)
    public async addRentingHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const files = request.files as Express.Multer.File[];
            const images = await this.imageService.uploadImages(files);

            const rentingData: Renting = {
                ...request.body,
                images: images,
            };
            const renting = await this.rentingService.addRenting(rentingData);
            response.status(201).json(renting);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/", requireAuth)
    public async getRentingsHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const rentings = await this.rentingService.getRentings();
            response.status(200).json(rentings);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/category/:category", requireAuth)
    public async getRentingsByCategoryHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const category = request.params.category;
            const rentings = await this.rentingService.getRentingsByCategory(category);
            response.status(200).json(rentings);
        } catch (error) {
            next(error);
        }
    }
}
