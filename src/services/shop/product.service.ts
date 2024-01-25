import Product, {IProduct} from "../../models/Product";
import mongoose from "mongoose";
import {inject, injectable} from "inversify";
import {BaseService} from "../base.service";
import {Logger} from "../../utils/logger";

@injectable()
export class ProductService extends BaseService {
    constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }

    async getAllProducts(): Promise<IProduct[]> {
        await this.logger.logInfo('Getting all products');
        return Product.find();
    }

    async getProductById(productId: string): Promise<IProduct | null> {
        await this.logger.logInfo(`Getting product with ID: ${productId}`);
        return Product.findById(productId);
    }

    async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
        await this.logger.logInfo('Creating new product');
        return await Product.create(productData);
    }

    async updateProduct(productId: string, updatedData: Partial<IProduct>): Promise<IProduct | null> {
        await this.logger.logInfo(`Updating product with ID: ${productId}`);
        return Product.findByIdAndUpdate(productId, updatedData, {new: true});
    }

    async deleteProduct(productId: string): Promise<boolean> {
        await this.logger.logInfo(`Deleting product with ID: ${productId}`);
        const result = await Product.deleteOne({_id: productId});
        return result.deletedCount !== 0;
    }

    async searchProductsByCategory(category: string): Promise<IProduct[]> {
        await this.logger.logInfo(`Searching products by category: ${category}`);
        return Product.find({category_id: new mongoose.Types.ObjectId(category)});
    }
}