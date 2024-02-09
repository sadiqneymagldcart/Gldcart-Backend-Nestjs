import { inject } from "inversify";
import { RentingModel } from "../../models/shop/Renting";
import { Logger } from "../../utils/logger";
import { BaseService } from "../base.service";

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
}
