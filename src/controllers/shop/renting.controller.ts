import * as express from "express";
import { inject } from "inversify";
import {
    Controller,
    controller,
    httpGet,
    httpPost,
} from "inversify-express-utils";
import { RentingService } from "@services/shop/renting.service";
import { multerMiddleware } from "@middlewares/malter.middleware";
import { IRenting } from "@models/shop/product/Renting";
import { AwsStorage } from "@storages/aws.storage";
import { AuthenticationMiddleware } from "@middlewares/authentication.middleware";

@controller("/renting", AuthenticationMiddleware)
export class RentingController implements Controller {
    private readonly rentingService: RentingService;
    private readonly storage: AwsStorage;

    public constructor(
        @inject(RentingService) rentingService: RentingService,
        @inject(AwsStorage) storage: AwsStorage,
    ) {
        this.rentingService = rentingService;
        this.storage = storage;
    }

    @httpPost("/", multerMiddleware.any())
    public async addRenting(
        request: express.Request,
        next: express.NextFunction,
    ) {
        const files = request.files as Express.Multer.File[];
        try {
            const images = await this.storage.upload(files);
            const rentingData: IRenting = {
                ...request.body,
                images: images,
            };
            return await this.rentingService.addRentingProduct(rentingData);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/")
    public async getRentings(next: express.NextFunction) {
        try {
            return await this.rentingService.getRentings();
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/category/:category")
    public async getRentingsByCategory(
        request: express.Request,
        next: express.NextFunction,
    ) {
        const category = request.params.category;
        try {
            return await this.rentingService.getRentingsByCategory(category);
        } catch (error) {
            next(error);
        }
    }
}
