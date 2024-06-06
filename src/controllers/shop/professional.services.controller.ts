import * as express from "express";
import { inject } from "inversify";
import {
    BaseHttpController,
    controller,
    httpGet,
    httpPost,
} from "inversify-express-utils";
import { ProfessionalServicesService } from "@services/shop/professional-services.service";
import { FileService } from "@services/shop/image.service";
import { multerMiddleware } from "@/middlewares/malter.middleware";
import { IProfessionalService } from "@models/shop/product/ProfessionalService";
import { AuthenticationMiddleware } from "@middlewares/authentication.middleware";

@controller("/professional-services", AuthenticationMiddleware)
export class ProfessionalServicesController extends BaseHttpController {
    private readonly fileService: FileService;
    private readonly servicesService: ProfessionalServicesService;

    public constructor(
        @inject(ProfessionalServicesService)
        servicesService: ProfessionalServicesService,
        @inject(FileService) fileService: FileService,
    ) {
        super();
        this.servicesService = servicesService;
        this.fileService = fileService;
    }

    @httpPost("/", multerMiddleware.any())
    public async addService(request: express.Request) {
        const files = request.files as Express.Multer.File[];
        const images = await this.fileService.uploadImagesWithAws(files);

        if (images.length === 0) {
            return this.badRequest("At least one image is required.");
        }

        const serviceData: IProfessionalService = {
            ...request.body,
            images: images,
        };

        const createdService =
            await this.servicesService.createService(serviceData);
        return this.created(
            `/professional-services/${createdService.id}`,
            createdService,
        );
    }

    @httpGet("/count")
    public async getServicesCount() {
        const count = await this.servicesService.getServicesCount();
        return this.ok(count);
    }

    @httpGet("/")
    public async getAllServices() {
        const services = await this.servicesService.getAllServices();
        return this.ok(services);
    }

    @httpGet("/search/filters")
    public async getServicesByFilters(request: express.Request) {
        const filters = request.query as any;
        const services = await this.servicesService.getServicesByQuery(filters);
        return this.ok(services);
    }

    @httpGet("/category/:category")
    public async getServicesByCategory(request: express.Request) {
        const category = request.params.category;
        const services = await this.servicesService.getServicesByCategory(category);
        return this.ok(services);
    }
}
