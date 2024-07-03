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
import { requireAuth } from "@middlewares/auth.middleware";
import { multerMiddleware } from "@middlewares/malter.middleware";
import { Product } from "@models/shop/product/Product";
import { AwsStorage } from "@storages/aws.storage";

@controller("/products")
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
        response: express.Response,
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

    @httpGet("/count", requireAuth)
    public async getProductCount(
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            return await this.productService.getProductsCount();
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/", requireAuth)
    public async getAllProducts(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            return await this.productService.getAllProducts();
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/category/:category", requireAuth)
    public async getProductByCategory(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        const category = request.params.category;
        try {
            return await this.productService.getProductByCategory(category);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/:productId", requireAuth)
    public async getProductById(
        request: express.Request,
        response: express.Response,
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
    @httpGet("/search/filters", requireAuth)
    public async searchProductsByFilters(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        const filters = request.query;
        try {
            return await this.productService.searchProductsByFilters(filters);
        } catch (error) {
            next(error);
        }
    }

    @httpDelete("/:productId", requireAuth)
    public async deleteProduct(
        request: express.Request,
        response: express.Response,
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
        response: express.Response,
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
        response: express.Response,
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
