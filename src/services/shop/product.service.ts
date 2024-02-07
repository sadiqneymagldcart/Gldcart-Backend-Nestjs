import { Product, ProductModel } from "../../models/shop/Product";
import mongoose from "mongoose";
import { inject, injectable } from "inversify";
import { BaseService } from "../base.service";
import { Logger } from "../../utils/logger";

@injectable()
export class ProductService extends BaseService {
    public constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }

    public async addProduct(product: Product): Promise<Product> {
        this.logger.logInfo("Adding product");
        const newProduct = new ProductModel(product);
        return newProduct.save();
    }

    public async getAllProducts(): Promise<Product[]> {
        this.logger.logInfo("Getting all products");
        return ProductModel.find();
    }

    public async getAllProductsWithStock(): Promise<Product[]> {
        this.logger.logInfo("Getting all products with stock");
        return ProductModel.find({ quantity: { $gt: 0 } });
    }

    public async getProductsWithPagination(
        page: number,
        limit: number,
    ): Promise<Product[]> {
        this.logger.logInfo(
            `Getting products with pagination. Page: ${page}, Limit: ${limit}`,
        );
        return ProductModel.find()
            .skip((page - 1) * limit)
            .limit(limit);
    }

    public async getProductByCategory(category: string): Promise<Product[]> {
        this.logger.logInfo(`Getting products by category: ${category}`);
        return ProductModel.find({ category: category });
    }

    public async getProductById(productId: string): Promise<Product | null> {
        this.logger.logInfo(`Getting product with ID: ${productId}`);
        return ProductModel.findById(productId);
    }

    public async updateProduct(
        productId: string,
        updatedData: Partial<Product>,
    ): Promise<Product | null> {
        this.logger.logInfo(`Updating product with ID: ${productId}`);
        return ProductModel.findByIdAndUpdate(productId, updatedData, {
            new: true,
        });
    }

    public async deleteProduct(productId: string): Promise<boolean> {
        this.logger.logInfo(`Deleting product with ID: ${productId}`);
        const result = await ProductModel.deleteOne({ _id: productId });
        return result.deletedCount !== 0;
    }

    public async searchProductsByCategory(category: string): Promise<Product[]> {
        this.logger.logInfo(`Searching products by category: ${category}`);
        return ProductModel.find({category: category});
    }

    public async searchProductsGlobal(query: string): Promise<Product[]> {
        this.logger.logInfo(`Searching products by query: ${query}`);
        return ProductModel.find({ $text: { $search: query } });
    }

    public async searchProductsByManufacturer(
        manufacturer: string,
    ): Promise<Product[]> {
        this.logger.logInfo(`Searching products by manufacturer: ${manufacturer}`);
        return ProductModel.find({
            manufacturer: { $regex: manufacturer, $options: "i" },
        });
    }

    public async searchProductsByPrice(price: string): Promise<Product[]> {
        this.logger.logInfo(`Searching products by price: ${price}`);
        return ProductModel.find({ price: { $lte: price } });
    }

    public async searchProductsByPriceRange(
        minPrice: string,
        maxPrice: string,
    ): Promise<Product[]> {
        this.logger.logInfo(
            `Searching products by price range: ${minPrice} - ${maxPrice}`,
        );
        return ProductModel.find({ price: { $gte: minPrice, $lte: maxPrice } });
    }

    public async searchProductsByPriceAndCategory(
        price: string,
        category: string,
    ): Promise<Product[]> {
        this.logger.logInfo(
            `Searching products by price: ${price} and category: ${category}`,
        );
        return ProductModel.find({
            price: { $lte: price },
            category_id: new mongoose.Types.ObjectId(category),
        });
    }

    public async searchProductsByPriceAndManufacturer(
        price: string,
        manufacturer: string,
    ): Promise<Product[]> {
        this.logger.logInfo(
            `Searching products by price: ${price} and manufacturer: ${manufacturer}`,
        );
        return ProductModel.find({
            price: { $lte: price },
            manufacturer: { $regex: manufacturer, $options: "i" },
        });
    }

    public async searchProductsByPriceAndCategoryAndManufacturer(
        price: number,
        category: string,
        manufacturer: string,
    ): Promise<Product[]> {
        this.logger.logInfo(
            `Searching products by price: ${price}, category: ${category} and manufacturer: ${manufacturer}`,
        );
        return ProductModel.find({
            price: { $lte: price },
            category_id: new mongoose.Types.ObjectId(category),
            manufacturer: { $regex: manufacturer, $options: "i" },
        });
    }

    public async searchProductsByCategoryAndManufacturer(
        category: string,
        manufacturer: string,
    ): Promise<Product[]> {
        this.logger.logInfo(
            `Searching products by category: ${category} and manufacturer: ${manufacturer}`,
        );
        return ProductModel.find({
            category_id: new mongoose.Types.ObjectId(category),
            manufacturer: { $regex: manufacturer, $options: "i" },
        });
    }

    public async searchProductsByCategoryAndPriceRange(
        category: string,
        minPrice: number,
        maxPrice: number,
    ): Promise<Product[]> {
        this.logger.logInfo(
            `Searching products by category: ${category} and price range: ${minPrice} - ${maxPrice}`,
        );
        return ProductModel.find({
            category_id: new mongoose.Types.ObjectId(category),
            price: { $gte: minPrice, $lte: maxPrice },
        });
    }

    public async searchProductsByManufacturerAndPriceRange(
        manufacturer: string,
        minPrice: number,
        maxPrice: number,
    ): Promise<Product[]> {
        this.logger.logInfo(
            `Searching products by manufacturer: ${manufacturer} and price range: ${minPrice} - ${maxPrice}`,
        );
        return ProductModel.find({
            manufacturer: { $regex: manufacturer, $options: "i" },
            price: { $gte: minPrice, $lte: maxPrice },
        });
    }

    public async searchProductsByCategoryAndManufacturerAndPriceRange(
        category: string,
        manufacturer: string,
        minPrice: number,
        maxPrice: number,
    ): Promise<Product[]> {
        this.logger.logInfo(
            `Searching products by category: ${category}, manufacturer: ${manufacturer} and price range: ${minPrice} - ${maxPrice}`,
        );
        return ProductModel.find({
            category_id: new mongoose.Types.ObjectId(category),
            manufacturer: { $regex: manufacturer, $options: "i" },
            price: { $gte: minPrice, $lte: maxPrice },
        });
    }
}
