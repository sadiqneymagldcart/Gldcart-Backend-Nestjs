import * as express from "express";
import {
    controller,
    httpDelete,
    httpGet,
    httpPost,
} from "inversify-express-utils";
import { ProductService } from "../../services/shop/product.service";
import { inject } from "inversify";
import { requireAuth } from "../../middlewares/auth.middleware";
import { multerMiddleware } from "../../middlewares/malter.middleware";
import { FileService } from "../../services/shop/image.service";
import { Product } from "../../models/shop/product/Product";
import { PutObjectCommand, S3, S3Client } from "@aws-sdk/client-s3";

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS;
const secretKey = process.env.AWS_SECRET;

const s3 = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
    },
});

@controller("/products")
export class ProductController {
    private readonly productService: ProductService;
    private readonly fileService: FileService;

    public constructor(
        @inject(ProductService) productService: ProductService,
        @inject(FileService) fileService: FileService,
    ) {
        this.productService = productService;
        this.fileService = fileService;
    }

    @httpPost("/", multerMiddleware.any(), requireAuth)
    public async addProductHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const files = request.files as Express.Multer.File[];

            const params = {
                Bucket: bucketName,
                Key: files[0].originalname,
                Body: files[0].buffer,
                ContentType: files[0].mimetype,
            };

            const command = new PutObjectCommand(params);
            await s3.send(command);

            // const images = await this.imageService.uploadImages(files);

            const productData: Product = {
                ...request.body,
                images: files,
            };
            const product = await this.productService.addProduct(productData);
            response.status(201).json(product);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    @httpGet("/pagination", requireAuth)
    public async getProductsWithPaginationHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const page = parseInt(request.query.page as string);
            const limit = parseInt(request.query.limit as string);
            const products = await this.productService.getProductsWithPagination(
                page,
                limit,
            );
            response.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/count", requireAuth)
    public async getProductCountHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const count = await this.productService.getProductsCount();
            response.status(200).json(count);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/", requireAuth)
    public async getAllProductsHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const products = await this.productService.getAllProducts();
            response.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/stock", requireAuth)
    public async getAllProductsWithStockHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const products = await this.productService.getAllProductsWithStock();
            response.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/category/:category", requireAuth)
    public async getProductByCategoryHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const category = request.params.category;
            const products = await this.productService.getProductByCategory(category);
            response.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/:productId", requireAuth)
    public async getProductByIdHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const productId = request.params.productId;
            const product = await this.productService.getProductById(productId);
            response.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/:productId", requireAuth)
    public async updateProductHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const productId = request.params.productId;
            const updatedData = request.body;
            const product = await this.productService.updateProduct(
                productId,
                updatedData,
            );
            response.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }

    @httpDelete("/:productId", requireAuth)
    public async deleteProductHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const productId = request.params.productId;
            const result = await this.productService.deleteProduct(productId);
            response.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/search/category/:category")
    public async searchProductsByCategoryHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const category = request.params.category;
            const products =
                await this.productService.searchProductsByCategory(category);
            response.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/search/:query")
    public async searchProductsGlobalHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const query = request.params.query;
            const products = await this.productService.searchProductsGlobal(query);
            response.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/search/manufacturer/:manufacturer")
    public async searchProductsByManufacturerHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const manufacturer = request.params.manufacturer;
            const products =
                await this.productService.searchProductsByManufacturer(manufacturer);
            response.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/search/price/:price")
    public async searchProductsByPriceHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const price = request.params.price;
            const products = await this.productService.searchProductsByPrice(price);
            response.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/search/price-range/:minPrice/:maxPrice")
    public async searchProductsByPriceRangeHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const minPrice = request.params.minPrice;
            const maxPrice = request.params.maxPrice;
            const products = await this.productService.searchProductsByPriceRange(
                minPrice,
                maxPrice,
            );
            response.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("")
    public async() { }
}
