import * as express from "express";
import {
    BaseHttpController,
    controller,
    httpDelete,
    httpGet,
    httpPost,
} from "inversify-express-utils";
import { ProductService } from "@services/shop/product.service";
import { inject } from "inversify";
import { multerMiddleware } from "@middlewares/malter.middleware";
import { IProduct } from "@models/shop/product/Product";
import { AwsStorage } from "@storages/aws.storage";
import { AuthenticationMiddleware } from "@middlewares/authentication.middleware";

@controller("/products", AuthenticationMiddleware)
export class ProductController extends BaseHttpController {
    private readonly productService: ProductService;
    private readonly awsStorage: AwsStorage;

    public constructor(
        @inject(ProductService) productService: ProductService,
        @inject(AwsStorage) awsStorage: AwsStorage,
    ) {
        super();
        this.productService = productService;
        this.awsStorage = awsStorage;
    }

    @httpPost("/", multerMiddleware.any())
    public async addProduct(request: express.Request) {
        const files = request.files as Express.Multer.File[];
        const images = await this.awsStorage.upload(files);
        const productData: IProduct = {
            ...request.body,
            images: images,
        };
        const product = await this.productService.addProduct(productData);
        return this.json(product, 201);
    }

    @httpGet("/count")
    public async getProductCount() {
        const count = await this.productService.getProductsCount();
        return this.json(count);
    }

    @httpGet("/")
    public async getAllProducts() {
        const products = await this.productService.getAllProducts();
        return this.json(products);
    }

    @httpGet("/category/:category")
    public async getProductByCategory(request: express.Request) {
        const category = request.params.category;
        const products = await this.productService.getProductByCategory(category);
        return this.json(products);
    }

    @httpGet("/:productId")
    public async getProductById(request: express.Request) {
        const productId = request.params.productId;
        const product = await this.productService.getProductById(productId);
        return this.json(product);
    }

    @httpGet("/search/filters")
    public async searchProductsByFilters(request: express.Request) {
        const filters = request.query;
        const products = await this.productService.searchProductsByFilters(filters);
        return this.json(products);
    }

    @httpDelete("/:productId")
    public async deleteProduct(request: express.Request) {
        const productId = request.params.productId;
        const result = await this.productService.deleteProduct(productId);
        return this.json(result);
    }

    @httpGet("/search/category/:category")
    public async searchProductsByCategory(request: express.Request) {
        const category = request.params.category;
        const products =
            await this.productService.searchProductsByCategory(category);
        return this.json(products);
    }

    @httpGet("/search/:query")
    public async searchProductsGlobally(request: express.Request) {
        const query = request.params.query;
        const products = await this.productService.searchProductsGlobal(query);
        return this.json(products);
    }
}
