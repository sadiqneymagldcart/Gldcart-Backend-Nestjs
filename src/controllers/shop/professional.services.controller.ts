import * as express from "express";
import { inject } from "inversify";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { ProfessionalServicesService } from "@services/shop/professional-services.service";
import { FileService } from "@services/shop/image.service";
import { multerMiddleware } from "@/middlewares/malter.middleware";
import { requireAuth } from "@/middlewares/auth.middleware";
import { ProfessionalService } from "@/models/shop/product/ProfessionalService";

@controller("/professional-services")
export class ProfessionalServicesController {
    private readonly _fileService: FileService;
    private readonly _servicesService: ProfessionalServicesService;

    public constructor(
        @inject(ProfessionalServicesService)
        servicesService: ProfessionalServicesService,
        @inject(FileService) fileService: FileService,
    ) {
        this._servicesService = servicesService;
        this._fileService = fileService;
    }

    @httpPost("/", multerMiddleware.any(), requireAuth)
    public async addService(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const files = request.files as Express.Multer.File[];
            const images = await this._fileService.uploadImagesWithAws(files);

            if (images.length === 0) {
                return response
                    .status(400)
                    .json({ message: "At least one image is required." });
            }

            const serviceData: ProfessionalService = {
                ...request.body,
                images: images,
            };
            const service = await this._servicesService.createService(serviceData);
            response.status(201).json(service);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    
    @httpGet("/count", requireAuth)
    public async getServicesCount(
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const count = await this._servicesService.getServicesCount();
            response.status(200).json(count);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/", requireAuth)
    public async getAllServices(
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const services = await this._servicesService.getAllServices();
            response.status(200).json(services);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/search/filters")
    public async getServicesByFilters(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const filters = request.query as any;
            const services = await this._servicesService.getServicesByQuery(filters);
            response.status(200).json(services);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/category/:category", requireAuth)
    public async getServicesByCategory(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const category = request.params.category;
            const services =
                await this._servicesService.getServicesByCategory(category);
            response.status(200).json(services);
        } catch (error) {
            next(error);
        }
    }
}
