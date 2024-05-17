import * as express from "express";
import { inject } from "inversify";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { RentingService } from "@services/shop/renting.service";
import { multerMiddleware } from "@middlewares/malter.middleware";
import { requireAuth } from "@middlewares/auth.middleware";
import { Renting } from "@models/shop/product/Renting";
import { AwsStorage } from "@storages/aws.storage";

@controller("/renting")
export class RentingController {
    private readonly _rentingService: RentingService;
    private readonly _storage: AwsStorage;

    public constructor(
        @inject(RentingService) rentingService: RentingService,
        @inject(AwsStorage) storage: AwsStorage,
    ) {
        this._rentingService = rentingService;
        this._storage = storage;
    }

    @httpPost("/", requireAuth, multerMiddleware.any())
    public async addRenting(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const files = request.files as Express.Multer.File[];
            const images = await this._storage.upload(files);
            const rentingData: Renting = {
                ...request.body,
                images: images,
            };
            const renting = await this._rentingService.addRentingProduct(rentingData);
            response.status(201).json(renting);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/", requireAuth)
    public async getRentings(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const rentings = await this._rentingService.getRentings();
            response.status(200).json(rentings);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/category/:category")
    public async getRentingsByCategory(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const category = request.params.category;
            const rentings =
                await this._rentingService.getRentingsByCategory(category);
            response.status(200).json(rentings);
        } catch (error) {
            next(error);
        }
    }
}
