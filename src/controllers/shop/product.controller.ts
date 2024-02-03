import * as express from "express";
import {
    controller,
    httpDelete,
    httpGet,
    httpPost,
    httpPut,
} from "inversify-express-utils";
import { ProductService } from "../../services/shop/product.service";
import { inject } from "inversify";
import { requireAuth } from "../../middlewares/auth.middleware";

@controller("/products")
export class ProductController {
    private readonly productService: ProductService;

    constructor(@inject(ProductService) productService: ProductService) {
        this.productService = productService;
    }

    @httpPost("/", requireAuth)
    public async addProductHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        const { productData } = request.body;
        try {
            await this.productService.createProduct(productData);
            response.status(200).json({ message: "Product was added successfully." });
        } catch (error) {
            next(error);
        }
    }

    @httpPut("/:productId", requireAuth)
    public async updateProductHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        const productId = request.params.productId;
        const { updatedData } = request.body;
        try {
            await this.productService.updateProduct(productId, updatedData);
            response
                .status(200)
                .json({ message: "Product was updated successfully." });
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
        const productId = request.params.productId;
        try {
            await this.productService.deleteProduct(productId);
            response
                .status(200)
                .json({ message: "Product was deleted successfully." });
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

    @httpGet("/:productId", requireAuth)
    public async getProductByIdHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        const productId = request.params.productId;
        try {
            const product = await this.productService.getProductById(productId);
            response.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/searchByCategory/:category", requireAuth)
    public async searchProductsByCategoryHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        const category = request.params.category;
        try {
            const products =
                await this.productService.searchProductsByCategory(category);
            response.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/search/:query", requireAuth)
    public async searchProductsGlobalHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        const query = request.params.query;
        try {
            const products = await this.productService.searchProductsGlobal(query);
            response.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/searchByManufacturer/:manufacturer", requireAuth)
    public async searchProductsByManufacturerHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        const manufacturer = request.params.manufacturer;
        try {
            const products =
                await this.productService.searchProductsByManufacturer(manufacturer);
            response.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/searchByPrice/:price", requireAuth)
    public async searchProductsByPriceHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        const price = request.params.price;
        try {
            const products = await this.productService.searchProductsByPrice(price);
            response.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/searchByPriceRange/:minPrice/:maxPrice", requireAuth)
    public async searchProductsByPriceRangeHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        const minPrice = request.params.minPrice;
        const maxPrice = request.params.maxPrice;
        try {
            const products = await this.productService.searchProductsByPriceRange(
                minPrice,
                maxPrice,
            );
            response.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/searchByPriceAndCategory/:price/:category", requireAuth)
    public async searchProductsByPriceAndCategoryHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        const price = request.params.price;
        const category = request.params.category;
        try {
            const products =
                await this.productService.searchProductsByPriceAndCategory(
                    price,
                    category,
                );
            response.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/searchByPriceAndManufacturer/:price/:manufacturer", requireAuth)
    public async searchProductsByPriceAndManufacturerHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        const price = request.params.price;
        const manufacturer = request.params.manufacturer;
        try {
            const products =
                await this.productService.searchProductsByPriceAndManufacturer(
                    price,
                    manufacturer,
                );
            response.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }
}
