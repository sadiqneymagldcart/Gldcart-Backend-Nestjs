import * as express from "express";
import { inject } from "inversify";
import {
    Controller,
    controller,
    httpGet,
    httpPost,
} from "inversify-express-utils";
import { ProfessionalServicesService } from "@services/shop/professional-services.service";
import { FileService } from "@services/shop/image.service";
import { multerMiddleware } from "@/middlewares/malter.middleware";
import { ProfessionalService } from "@/models/shop/product/ProfessionalService";
import { AuthenticationMiddleware } from "@middlewares/auth.middleware";

@controller("/professional-services", AuthenticationMiddleware)
export class ProfessionalServicesController implements Controller {
    private readonly fileService: FileService;
    private readonly servicesService: ProfessionalServicesService;

    public constructor(
        @inject(ProfessionalServicesService)
        servicesService: ProfessionalServicesService,
        @inject(FileService) fileService: FileService,
    ) {
        this.servicesService = servicesService;
        this.fileService = fileService;
    }

    @httpPost("/", multerMiddleware.any())
    public async addService(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const files = request.files as Express.Multer.File[];
            const images = await this.fileService.uploadImagesWithAws(files);

            if (images.length === 0) {
                return response
                    .status(400)
                    .json({ message: "At least one image is required." });
            }

            const serviceData: ProfessionalService = {
                ...request.body,
                images: images,
            };
            return await this.servicesService.createService(serviceData);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    @httpGet("/count")
    public async getServicesCount(next: express.NextFunction) {
        try {
            return await this.servicesService.getServicesCount();
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/")
    public async getAllServices(next: express.NextFunction) {
        try {
            return await this.servicesService.getAllServices();
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/search/filters")
    public async getServicesByFilters(
        request: express.Request,
        next: express.NextFunction,
    ) {
        const filters = request.query as any;
        try {
            return await this.servicesService.getServicesByQuery(filters);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/category/:category")
    public async getServicesByCategory(
        request: express.Request,
        next: express.NextFunction,
    ) {
        const category = request.params.category;
        try {
            return await this.servicesService.getServicesByCategory(category);
        } catch (error) {
            next(error);
        }
    }
}
