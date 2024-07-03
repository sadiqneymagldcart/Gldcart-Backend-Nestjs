import { inject, injectable } from "inversify";
import { BaseService } from "../base.service";
import { Logger } from "../../utils/logger";
import {
    ProfessionalService,
    ServicesModel,
} from "../../models/shop/ProfessionalService";

@injectable()
export class ProfessionalServicesService extends BaseService {
    public constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }

    public async getServicesWithPagination(
        page: number,
        limit: number,
    ): Promise<ProfessionalService[]> {
        this.logger.logInfo(
            `Getting products with pagination. Page: ${page}, Limit: ${limit}`,
        );
        return ServicesModel.find()
            .skip((page - 1) * limit)
            .limit(limit);
    }

    public async getServicesCount(): Promise<number> {
        this.logger.logInfo("Getting products count");
        return ServicesModel.countDocuments();
    }

    public async getServices(): Promise<ProfessionalService[]> {
        this.logger.logInfo("Getting products");
        return ServicesModel.find();
    }

    public async createService(
        service: ProfessionalService,
    ): Promise<ProfessionalService> {
        this.logger.logInfo("Creating product");
        return ServicesModel.create(service);
    }

    public async updateService(
        serviceId: string,
        service: ProfessionalService,
    ): Promise<ProfessionalService> {
        this.logger.logInfo("Updating product");
        return ServicesModel.findByIdAndUpdate(serviceId, service, {
            new: true,
        });
    }

    public async deleteService(serviceId: string) {
        this.logger.logInfo("Deleting product");
        return ServicesModel.findByIdAndDelete(serviceId);
    }

    public async getServiceById(serviceId: string): Promise<ProfessionalService> {
        this.logger.logInfo("Getting product by id");
        return ServicesModel.findById(serviceId);
    }

    public async getServicesByUserId(
        userId: string,
    ): Promise<ProfessionalService[]> {
        this.logger.logInfo("Getting products by user id");
        return ServicesModel.find({ userId });
    }
}
