import * as express from "express";
import {
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
export class ProductController {
    private readonly _productService: ProductService;
    private readonly _awsStorage: AwsStorage;

    public constructor(
        @inject(ProductService) productService: ProductService,
        @inject(AwsStorage) awsStorage: AwsStorage,
    ) {
        this._productService = productService;
        this._awsStorage = awsStorage;
    }

    @httpPost("/", multerMiddleware.any())
    public async addProduct(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const files = request.files as Express.Multer.File[];
            const images = await this._awsStorage.upload(files);
            const productData: Product = {
                ...request.body,
                images: images,
            };
            const product = await this._productService.addProduct(productData);
            response.status(201).json(product);
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
            const count = await this._productService.getProductsCount();
            response.status(200).json(count);
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
            const products = await this._productService.getAllProducts();
            response.status(201).json(products);
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
        try {
            const category = request.params.category;
            const products = await this._productService.getProductByCategory(category);
            response.status(200).json(products);
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
        try {
            const productId = request.params.productId;
            console.log(productId);
            const product = await this._productService.getProductById(productId);
            response.status(201).json(product);
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
        try {
            const filters = request.query;
            const products =
                await this._productService.searchProductsByFilters(filters);
            response.status(200).json(products);
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
        try {
            const productId = request.params.productId;
            const result = await this._productService.deleteProduct(productId);
            response.status(200).json(result);
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
        try {
            const category = request.params.category;
            const products =
                await this._productService.searchProductsByCategory(category);
            response.status(200).json(products);
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
        try {
            const query = request.params.query;
            const products = await this._productService.searchProductsGlobal(query);
            response.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("")
    public async() { }
}
