import {controller, httpDelete, httpGet, httpPost, httpPut,} from "inversify-express-utils";
import {ProductService} from "../../services/shop/product.service";
import {inject} from "inversify";
import {NextFunction, Request, Response} from "express";

@controller("/product")
export class ProductController {
    private readonly productService: ProductService;

    constructor(@inject(ProductService) productService: ProductService) {
        this.productService = productService;
    }

    @httpPost("/add")
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

    @httpPut("/update")
    public async updateProductHandler(
        request: Request,
        response: Response,
        next: NextFunction,
    ) {
        const {productId, updatedData} = request.body;
        try {
            await this.productService.updateProduct(productId, updatedData);
            response
                .status(200)
                .json({message: "Product was updated successfully."});
        } catch (error) {
            next(error);
        }
    }

    @httpDelete("/delete")
    public async deleteProductHandler(
        request: Request,
        response: Response,
        next: NextFunction,
    ) {
        const {productId} = request.body;
        try {
            await this.productService.deleteProduct(productId);
            response
                .status(200)
                .json({message: "Product was deleted successfully."});
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/all")
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

    @httpGet("/byId")
    public async getProductByIdHandler(
        request: Request,
        response: Response,
        next: NextFunction,
    ) {
        const {productId} = request.body;
        try {
            const product = await this.productService.getProductById(productId);
            response.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/byCategory")
    public async searchProductsByCategoryHandler(
        request: Request,
        response: Response,
        next: NextFunction,
    ) {
        const {category} = request.body;
        try {
            const products =
                await this.productService.searchProductsByCategory(category);
            response.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }
}
