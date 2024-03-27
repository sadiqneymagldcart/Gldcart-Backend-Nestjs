import { inject, injectable } from "inversify";
import { Logger } from "../../utils/logger";
import {
    ProfessionalService,
    ServicesModel,
} from "../../models/shop/product/ProfessionalService";
import { BaseService } from "../base/base.service";

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

    public async getServicesByQuery(
        query: string,
    ): Promise<ProfessionalService[]> {
        this.logger.logInfo(`Getting products by query: ${query}`);
        return ServicesModel.find({ $text: { $search: query } });
    }

    public async getServicesByCategoryWithPagination(
        category: string,
        page: number,
        limit: number,
    ): Promise<ProfessionalService[]> {
        this.logger.logInfo(
            `Getting products by category with pagination. Category: ${category}, Page: ${page}, Limit: ${limit}`,
        );
        return ServicesModel.find({ category })
            .skip((page - 1) * limit)
            .limit(limit);
    }

    public async getServicesCount(): Promise<number> {
        this.logger.logInfo("Getting products count");
        return ServicesModel.countDocuments();
    }

    public async getAllServices(): Promise<ProfessionalService[]> {
        this.logger.logInfo("Getting products");
        return ServicesModel.find();
    }

    public async createService(
        service: ProfessionalService,
    ): Promise<ProfessionalService> {
        this.logger.logInfo("Creating service");
        return ServicesModel.create(service);
    }

    public async updateService(
        serviceId: string,
        service: ProfessionalService,
    ): Promise<ProfessionalService> {
        this.logger.logInfo("Updating service");
        return ServicesModel.findByIdAndUpdate(serviceId, service, {
            new: true,
        });
    }

    public async deleteService(serviceId: string) {
        this.logger.logInfo("Deleting service");
        return ServicesModel.findByIdAndDelete(serviceId);
    }

    public async getServiceById(serviceId: string): Promise<ProfessionalService> {
        this.logger.logInfo("Getting service by id");
        return ServicesModel.findById(serviceId);
    }

    public async getServicesByUserId(
        userId: string,
    ): Promise<ProfessionalService[]> {
        this.logger.logInfo("Getting services by user id");
        return ServicesModel.find({ userId });
    }

    public async getServicesByCategory(
        category: string,
    ): Promise<ProfessionalService[]> {
        this.logger.logInfo(`Getting services by category ${category}`);
        return ServicesModel.find({ category });
    }
}
