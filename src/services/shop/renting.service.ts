import { inject } from "inversify";
import { IRenting, RentingModel } from "@models/shop/product/Renting";
import { Logger } from "@utils/logger";
import { BaseService } from "../base/base.service";

export class RentingService extends BaseService {
    public constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }
    public async addRentingProduct(rentingData: IRenting) {
        this.logger.logInfo("Adding renting", rentingData);
        return await RentingModel.create(rentingData);
    }
    public async getRentings() {
        this.logger.logInfo("Fetching rentings");
        return RentingModel.find();
    }
    public async getRentingById(id: string) {
        this.logger.logInfo(`Fetching renting with id: ${id}`);
        return RentingModel.findById(id);
    }

    public async deleteRenting(id: string) {
        this.logger.logInfo(`Deleting renting with id: ${id}`);
        return RentingModel.findByIdAndDelete(id);
    }
    public async updateRenting(id: string, rentingData: any) {
        this.logger.logInfo(`Updating renting with id: ${id}`);
        return RentingModel.findByIdAndUpdate(id, rentingData, {
            new: true,
        });
    }
    public async getRentingsByCategory(category: string) {
        const rentings = await RentingModel.find({ category });
        this.logger.logInfo(`Fetching rantings with category: ${category}`);
        return rentings;
    }
}
