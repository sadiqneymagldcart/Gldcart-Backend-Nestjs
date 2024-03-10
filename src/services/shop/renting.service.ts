import { inject } from "inversify";
import { RentingModel } from "../../models/shop/product/Renting";
import { Logger } from "../../utils/logger";
import { BaseService } from "../base/base.service";

export class RentingService extends BaseService {
    public constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }
    public async addRenting(rentingData: any) {
        this.logger.logInfo("Adding renting");
        return await RentingModel.create(rentingData);
    }
    public async getRentings() {
        this.logger.logInfo("Fetching rentings");
        return await RentingModel.find();
    }
    public async getRentingById(id: string) {
        this.logger.logInfo(`Fetching renting with id: ${id}`);
        return await RentingModel.findById(id);
    }

    public async deleteRenting(id: string) {
        this.logger.logInfo(`Deleting renting with id: ${id}`);
        return await RentingModel.findByIdAndDelete(id);
    }
    public async updateRenting(id: string, rentingData: any) {
        this.logger.logInfo(`Updating renting with id: ${id}`);
        return await RentingModel.findByIdAndUpdate(id, rentingData, {
            new: true,
        });
    }
    public async getRentingsByCategory(category: string) {
        this.logger.logInfo(`Fetching rentings with category: ${category}`);
        return await RentingModel.find({ category });
    }
}
