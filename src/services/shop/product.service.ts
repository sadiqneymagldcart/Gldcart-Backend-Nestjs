import { Product, ProductModel } from "@models/shop/product/Product";
import { inject, injectable } from "inversify";
import { BaseService } from "../base/base.service";
import { Logger } from "@utils/logger";

@injectable()
export class ProductService extends BaseService {
    public constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }

    public async addProduct(product: Product): Promise<Product> {
        const newProduct = await ProductModel.create(product);
        this.logger.logInfo("Adding product", newProduct);
        return newProduct;
    }

    public async getAllProducts(): Promise<Product[]> {
        const allProducts = ProductModel.find();
        return allProducts;
    }

    public async getAllProductsWithStock(): Promise<Product[]> {
        const products = ProductModel.find({ stock: { $gt: 0 } });
        // this.logger.logInfo("Getting all products with stock", { products });
        return products;
    }

    public async getProductsWithPagination(
        page: number,
        limit: number,
    ): Promise<Product[]> {
        const products = ProductModel.find()
            .skip((page - 1) * limit)
            .limit(limit);
        this.logger.logInfo(
            `Getting products on page ${page} with limit of ${limit}`,
            { products },
        );
        return products;
    }

    public async getProductsCount(): Promise<number> {
        const count = ProductModel.countDocuments();
        this.logger.logInfo("Getting products count", { count });
        return count;
    }

    public async getProductByCategory(category: string): Promise<Product[]> {
        const products = ProductModel.find({ category: category });
        return products;
    }

    public async getProductById(productId: string): Promise<Product | null> {
        const products = await ProductModel.findById(productId);
        // this.logger.logInfo(`Getting product with ID: ${productId}`, { products });
        return products;
    }

    public async getProductsCountByCategory(category: string): Promise<number> {
        this.logger.logInfo(`Getting products count by category: ${category}`);
        return ProductModel.findOne({ category: category }).count();
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

    public async updateProductStock(
        productId: string,
        quantity: number,
    ): Promise<Product | null> {
        this.logger.logInfo(`Updating product stock with ID: ${productId}`);
        return ProductModel.findByIdAndUpdate(
            productId,
            { $inc: { stock: quantity } },
            { new: true },
        );
    }

    public async deleteProduct(productId: string): Promise<boolean> {
        this.logger.logInfo(`Deleting product with ID: ${productId}`);
        const result = await ProductModel.deleteOne({ _id: productId });
        return result.deletedCount !== 0;
    }

    public async searchProductsByCategory(category: string): Promise<Product[]> {
        this.logger.logInfo(`Searching products by category: ${category}`);
        return ProductModel.find({ category: category });
    }

    public async searchProductsGlobal(query: string): Promise<Product[]> {
        this.logger.logInfo(`Searching products by query: ${query}`);
        return ProductModel.find({ $text: { $search: query } });
    }

    public async searchProductsByFilters(
        filters: Record<string, any>,
    ): Promise<Product[]> {
        const filtersCriteria = Object.keys(filters).map((key) => {
            return { [key]: filters[key] };
        });
        this.logger.logInfo(
            `Searching products by filters: ${JSON.stringify(filtersCriteria)}`,
        );
        return ProductModel.find({ $and: filtersCriteria });
    }
}
