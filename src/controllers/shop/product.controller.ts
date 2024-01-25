import {controller, httpDelete, httpGet, httpPost, httpPut,} from "inversify-express-utils";
import {ProductService} from "../../services/shop/product.service";
import {inject} from "inversify";
import {NextFunction, Request, Response} from "express";

@controller("/products")
export class ProductController {
    private readonly productService: ProductService;

    constructor(@inject(ProductService) productService: ProductService) {
        this.productService = productService;
    }

    @httpPost("/")
    public async addProductHandler(
        request: Request,
        response: Response,
        next: NextFunction,
    ) {
        const {productData} = request.body;
        try {
            await this.productService.createProduct(productData);
            response.status(200).json({message: "Product was added successfully."});
        } catch (error) {
            next(error);
        }
    }

    @httpPut("/:productId")
    public async updateProductHandler(
        request: Request,
        response: Response,
        next: NextFunction,
    ) {
        const productId = request.params.productId;
        const {updatedData} = request.body;
        try {
            await this.productService.updateProduct(productId, updatedData);
            response
                .status(200)
                .json({message: "Product was updated successfully."});
        } catch (error) {
            next(error);
        }
    }

    @httpDelete("/:productId")
    public async deleteProductHandler(
        request: Request,
        response: Response,
        next: NextFunction,
    ) {
        const productId = request.params.productId;
        try {
            await this.productService.deleteProduct(productId);
            response
                .status(200)
                .json({message: "Product was deleted successfully."});
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/")
    public async getAllProductsHandler(
        request: Request,
        response: Response,
        next: NextFunction,
    ) {
        try {
            const products = await this.productService.getAllProducts();
            response.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/:productId")
    public async getProductByIdHandler(
        request: Request,
        response: Response,
        next: NextFunction,
    ) {
        const productId = request.params.productId;
        try {
            const product = await this.productService.getProductById(productId);
            response.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/searchByCategory/:category")
    public async searchProductsByCategoryHandler(
        request: Request,
        response: Response,
        next: NextFunction,
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

    @httpPost("/search/:query")
    public async searchProductsGlobalHandler(request: Request, response: Response, next: NextFunction
    ) {
        const query = request.params.query;
        try {
            const products = await this.productService.searchProductsGlobal(query);
            response.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/searchByManufacturer/:manufacturer")
    public async searchProductsByManufacturerHandler(request: Request, response: Response, next: NextFunction) {
        const manufacturer = request.params.manufacturer;
        try {
            const products = await this.productService.searchProductsByManufacturer(manufacturer);
            response.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/searchByPrice/:price")
    public async searchProductsByPriceHandler(request: Request, response: Response, next: NextFunction) {
        const price = request.params.price;
        try {
            const products = await this.productService.searchProductsByPrice(price);
            response.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }
}
