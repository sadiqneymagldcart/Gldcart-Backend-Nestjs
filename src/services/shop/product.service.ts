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
        return await ProductModel.create(product);
    }

    public async getAllProducts(): Promise<Product[]> {
        return ProductModel.find();
    }

    public async getAllProductsWithStock(): Promise<Product[]> {
        return ProductModel.find({ stock: { $gt: 0 } });
    }

    public async getProductsWithPagination(
        page: number,
        limit: number,
    ): Promise<Product[]> {
        return ProductModel.find()
            .skip((page - 1) * limit)
            .limit(limit);
    }

    public async getProductsCount(): Promise<number> {
        return ProductModel.countDocuments();
    }

    public async getProductByCategory(category: string): Promise<Product[]> {
        return ProductModel.find({ category: category });
    }

    public async getProductById(productId: string): Promise<Product | null> {
        return ProductModel.findById(productId);
    }

    public async getProductsCountByCategory(category: string): Promise<number> {
        return ProductModel.findOne({ category: category }).count();
    }

    public async updateProduct(
        productId: string,
        updatedData: Partial<Product>,
    ): Promise<Product | null> {
        return ProductModel.findByIdAndUpdate(productId, updatedData, {
            new: true,
        });
    }

    public async updateProductStock(
        productId: string,
        quantity: number,
    ): Promise<Product | null> {
        return ProductModel.findByIdAndUpdate(
            productId,
            { $inc: { stock: quantity } },
            { new: true },
        );
    }

    public async deleteProduct(productId: string): Promise<boolean> {
        return (
            (await ProductModel.deleteOne({ _id: productId })).deletedCount !== 0
        );
    }

    public async searchProductsByCategory(category: string): Promise<Product[]> {
        return ProductModel.find({ category: category });
    }

    public async searchProductsGlobal(query: string): Promise<Product[]> {
        return ProductModel.find({ $text: { $search: query } });
    }

    public async searchProductsByFilters(
        filters: Record<string, any>,
    ): Promise<Product[]> {
        const filtersCriteria = Object.keys(filters).map((key) => {
            return { [key]: filters[key] };
        });
        return ProductModel.find({ $and: filtersCriteria });
    }
}
