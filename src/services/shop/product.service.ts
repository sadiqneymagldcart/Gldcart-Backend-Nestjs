import Product, {IProduct} from "../../models/shop/Product";
import mongoose from "mongoose";
import {inject, injectable} from "inversify";
import {BaseService} from "../base.service";
import {Logger} from "../../utils/logger";

@injectable()
export class ProductService extends BaseService {
    constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }

    public async getAllProducts(): Promise<IProduct[]> {
        await this.logger.logInfo('Getting all products');
        return Product.find();
    }

    public async getProductById(productId: string): Promise<IProduct | null> {
        await this.logger.logInfo(`Getting product with ID: ${productId}`);
        return Product.findById(productId);
    }

    public async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
        await this.logger.logInfo('Creating new product');
        return await Product.create(productData);
    }

    public async updateProduct(productId: string, updatedData: Partial<IProduct>): Promise<IProduct | null> {
        await this.logger.logInfo(`Updating product with ID: ${productId}`);
        return Product.findByIdAndUpdate(productId, updatedData, {new: true});
    }

    public async deleteProduct(productId: string): Promise<boolean> {
        await this.logger.logInfo(`Deleting product with ID: ${productId}`);
        const result = await Product.deleteOne({_id: productId});
        return result.deletedCount !== 0;
    }

    public async searchProductsByCategory(category: string): Promise<IProduct[]> {
        await this.logger.logInfo(`Searching products by category: ${category}`);
        return Product.find({category_id: new mongoose.Types.ObjectId(category)});
    }

    public async searchProductsGlobal(query: string): Promise<IProduct[]> {
        await this.logger.logInfo(`Searching products by query: ${query}`);
        return Product.find({$text: {$search: query}});
    }

    public async searchProductsByManufacturer(manufacturer: string): Promise<IProduct[]> {
        await this.logger.logInfo(`Searching products by manufacturer: ${manufacturer}`);
        return Product.find({manufacturer: {$regex: manufacturer, $options: 'i'}});
    }

    public async searchProductsByPrice(price: string): Promise<IProduct[]> {
        await this.logger.logInfo(`Searching products by price: ${price}`);
        return Product.find({price: {$lte: price}});
    }

    public async searchProductsByPriceRange(minPrice: number, maxPrice: number): Promise<IProduct[]> {
        await this.logger.logInfo(`Searching products by price range: ${minPrice} - ${maxPrice}`);
        return Product.find({price: {$gte: minPrice, $lte: maxPrice}});
    }

    public async searchProductsByPriceAndCategory(price: number, category: string): Promise<IProduct[]> {
        await this.logger.logInfo(`Searching products by price: ${price} and category: ${category}`);
        return Product.find({price: {$lte: price}, category_id: new mongoose.Types.ObjectId(category)});
    }

    public async searchProductsByPriceAndManufacturer(price: number, manufacturer: string): Promise<IProduct[]> {
        await this.logger.logInfo(`Searching products by price: ${price} and manufacturer: ${manufacturer}`);
        return Product.find({price: {$lte: price}, manufacturer: {$regex: manufacturer, $options: 'i'}});
    }

    public async searchProductsByPriceAndCategoryAndManufacturer(price: number, category: string, manufacturer: string): Promise<IProduct[]> {
        await this.logger.logInfo(`Searching products by price: ${price}, category: ${category} and manufacturer: ${manufacturer}`);
        return Product.find({
            price: {$lte: price},
            category_id: new mongoose.Types.ObjectId(category),
            manufacturer: {$regex: manufacturer, $options: 'i'}
        });
    }

    public async searchProductsByCategoryAndManufacturer(category: string, manufacturer: string): Promise<IProduct[]> {
        await this.logger.logInfo(`Searching products by category: ${category} and manufacturer: ${manufacturer}`);
        return Product.find({
            category_id: new mongoose.Types.ObjectId(category),
            manufacturer: {$regex: manufacturer, $options: 'i'}
        });
    }

    public async searchProductsByCategoryAndPriceRange(category: string, minPrice: number, maxPrice: number): Promise<IProduct[]> {
        await this.logger.logInfo(`Searching products by category: ${category} and price range: ${minPrice} - ${maxPrice}`);
        return Product.find({
            category_id: new mongoose.Types.ObjectId(category),
            price: {$gte: minPrice, $lte: maxPrice}
        });
    }

    public async searchProductsByManufacturerAndPriceRange(manufacturer: string, minPrice: number, maxPrice: number): Promise<IProduct[]> {
        await this.logger.logInfo(`Searching products by manufacturer: ${manufacturer} and price range: ${minPrice} - ${maxPrice}`);
        return Product.find({
            manufacturer: {$regex: manufacturer, $options: 'i'},
            price: {$gte: minPrice, $lte: maxPrice}
        });
    }

    public async searchProductsByCategoryAndManufacturerAndPriceRange(category: string, manufacturer: string, minPrice: number, maxPrice: number): Promise<IProduct[]> {
        await this.logger.logInfo(`Searching products by category: ${category}, manufacturer: ${manufacturer} and price range: ${minPrice} - ${maxPrice}`);
        return Product.find({
            category_id: new mongoose.Types.ObjectId(category),
            manufacturer: {$regex: manufacturer, $options: 'i'},
            price: {$gte: minPrice, $lte: maxPrice}
        });
    }
}
