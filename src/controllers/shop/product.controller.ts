import * as express from "express";
import {
    Controller,
    controller,
    httpDelete,
    httpGet,
    httpPost,
} from "inversify-express-utils";
import { ProductService } from "@services/shop/product.service";
import { inject } from "inversify";
import { authMiddleware } from "@middlewares/auth.middleware";
import { multerMiddleware } from "@middlewares/malter.middleware";
import { Product } from "@models/shop/product/Product";
import { AwsStorage } from "@storages/aws.storage";

@controller("/products", authMiddleware)
export class ProductController implements Controller {
    private readonly productService: ProductService;
    private readonly awsStorage: AwsStorage;

    public constructor(
        @inject(ProductService) productService: ProductService,
        @inject(AwsStorage) awsStorage: AwsStorage,
    ) {
        this.productService = productService;
        this.awsStorage = awsStorage;
    }

    @httpPost("/", multerMiddleware.any())
    public async addProduct(
        request: express.Request,
        next: express.NextFunction,
    ) {
        const files = request.files as Express.Multer.File[];
        try {
            const images = await this.awsStorage.upload(files);
            const productData: Product = {
                ...request.body,
                images: images,
            };
            return await this.productService.addProduct(productData);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/count")
    public async getProductCount(next: express.NextFunction) {
        try {
            return await this.productService.getProductsCount();
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/")
    public async getAllProducts(next: express.NextFunction) {
        try {
            return await this.productService.getAllProducts();
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/category/:category")
    public async getProductByCategory(
        request: express.Request,
        next: express.NextFunction,
    ) {
        const category = request.params.category;
        try {
            return await this.productService.getProductByCategory(category);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/:productId")
    public async getProductById(
        request: express.Request,
        next: express.NextFunction,
    ) {
        const productId = request.params.productId;
        try {
            console.log(productId);
            return await this.productService.getProductById(productId);
        } catch (error) {
            next(error);
        }
    }
    @httpGet("/search/filters")
    public async searchProductsByFilters(
        request: express.Request,
        next: express.NextFunction,
    ) {
        const filters = request.query;
        try {
            return await this.productService.searchProductsByFilters(filters);
        } catch (error) {
            next(error);
        }
    }

    @httpDelete("/:productId")
    public async deleteProduct(
        request: express.Request,
        next: express.NextFunction,
    ) {
        const productId = request.params.productId;
        try {
            return await this.productService.deleteProduct(productId);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/search/category/:category")
    public async searchProductsByCategory(
        request: express.Request,
        next: express.NextFunction,
    ) {
        const category = request.params.category;
        try {
            return await this.productService.searchProductsByCategory(category);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/search/:query")
    public async searchProductsGlobally(
        request: express.Request,
        next: express.NextFunction,
    ) {
        const query = request.params.query;
        try {
            return await this.productService.searchProductsGlobal(query);
        } catch (error) {
            next(error);
        }
    }
}
