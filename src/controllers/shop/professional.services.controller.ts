import * as express from "express";
import { inject } from "inversify";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { ProfessionalServicesService } from "../../services/shop/professional-services.service";
import { ImageService } from "../../services/shop/image.service";
import { multerMiddleware } from "../../middlewares/malter.middleware";
import { requireAuth } from "../../middlewares/auth.middleware";
import { ProfessionalService } from "../../models/shop/ProfessionalService";

@controller("/professional-services")
export class ProfessionalServicesController {
    private readonly imageService: ImageService;
    private readonly servicesService: ProfessionalServicesService;
    public constructor(
        @inject(ProfessionalServicesService)
        servicesService: ProfessionalServicesService,
        @inject(ImageService) imageService: ImageService,
    ) {
        this.servicesService = servicesService;
        this.imageService = imageService;
    }

    @httpPost("/", multerMiddleware.any(), requireAuth)
    public async addServiceHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const files = request.files as Express.Multer.File[];
            const images = await this.imageService.uploadImages(files);

            const serviceData: ProfessionalService = {
                ...request.body,
                images: images,
            };
            const service = await this.servicesService.createService(serviceData);
            response.status(201).json(service);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    @httpGet("/paginate", requireAuth)
    public async getServicesWithPaginationHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const { page, limit } = request.body;
            const services = await this.servicesService.getServicesWithPagination(
                page,
                limit,
            );
            response.status(200).json(services);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/count", requireAuth)
    public async getServicesCountHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const count = await this.servicesService.getServicesCount();
            response.status(200).json(count);
        } catch (error) {
            next(error);
        }
    }

}
