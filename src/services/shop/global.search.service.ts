import { inject, injectable } from "inversify";
import { Logger } from "../../utils/logger";
import { ProductModel } from "../../models/shop/product/Product";
import { RentingModel } from "../../models/shop/product/Renting";
import { ServicesModel } from "../../models/shop/product/ProfessionalService";
import { BaseService } from "../base/base.service";

@injectable()
export class SearchService extends BaseService {
    public constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }

    public async searchGlobally(query: string) {
        const products = await ProductModel.find({
            $or: [
                { product_name: { $regex: `^${query}`, $options: "i" } },
                { category: { $regex: `^${query}`, $options: "i" } },
                { subcategory: { $regex: `^${query}`, $options: "i" } },
            ],
        });
        const rentings = await RentingModel.find({
            $or: [
                { renting_name: { $regex: `^${query}`, $options: "i" } },
                { category: { $regex: `^${query}`, $options: "i" } },
                { subcategory: { $regex: `^${query}`, $options: "i" } },
            ],
        });
        const services = await ServicesModel.find({
            $or: [
                { service_name: { $regex: `^${query}`, $options: "i" } },
                { category: { $regex: `^${query}`, $options: "i" } },
                { subcategory: { $regex: `^${query}`, $options: "i" } },
            ],
        });
        return { products, rentings, services };
    }
}
