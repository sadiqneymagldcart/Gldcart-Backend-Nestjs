import * as express from "express";
import { inject } from "inversify";
import {
    BaseHttpController,
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
export class RentingController extends BaseHttpController {
    private readonly rentingService: RentingService;
    private readonly storage: AwsStorage;

    public constructor(
        @inject(RentingService) rentingService: RentingService,
        @inject(AwsStorage) storage: AwsStorage,
    ) {
        super();
        this.rentingService = rentingService;
        this.storage = storage;
    }

    @httpPost("/", multerMiddleware.any())
    public async addRenting(request: express.Request) {
        const files = request.files as Express.Multer.File[];
        const images = await this.storage.upload(files);
        const rentingData: IRenting = {
            ...request.body,
            images: images,
        };
        const renting = await this.rentingService.addRentingProduct(rentingData);
        return this.json(renting);
    }

    @httpGet("/")
    public async getRentings() {
        const rentings = await this.rentingService.getRentings();
        return this.json(rentings);
    }

    @httpGet("/category/:category")
    public async getRentingsByCategory(request: express.Request) {
        const category = request.params.category;
        const rentings = await this.rentingService.getRentingsByCategory(category);
        return this.json(rentings);
    }
}
