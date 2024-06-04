import * as express from "express";
import { inject } from "inversify";
import { CartService } from "@services/shop/cart.service";
import {
    controller,
    httpGet,
    httpPut,
    httpPost,
    httpDelete,
    Controller,
} from "inversify-express-utils";
import { AuthenticationMiddleware } from "@middlewares/authentication.middleware";

@controller("/cart", AuthenticationMiddleware)
export class CartController implements Controller {
    private readonly cartService: CartService;

    public constructor(@inject(CartService) cartService: CartService) {
        this.cartService = cartService;
    }

    @httpPost("/")
    public async createCart(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        const { userId } = request.body;

        if (!userId)
            return response.status(400).json({ message: "userId is required" });

        try {
            return await this.cartService.createCart(userId);
        } catch (error) {
            next(error);
        }
    }

    @httpDelete("/")
    public async deleteCart(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        const { userId } = request.body;

        if (!userId)
            return response.status(400).json({ message: "userId is required" });

        try {
            return await this.cartService.deleteCart(userId);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/user/:userId")
    public async getCart(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        const { userId } = request.params;

        if (!userId)
            return response.status(400).json({ message: "userId is required" });

        try {
            return await this.cartService.getCartItems(userId);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/add-item")
    public async addItem(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        const { userId, item } = request.body;

        if (!userId || !item)
            return response
                .status(400)
                .json({ message: "userId and item are required" });

        try {
            return await this.cartService.addItemToCart(userId, item);
        } catch (error) {
            next(error);
        }
    }

    @httpDelete("/remove-item")
    public async removeItem(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        const { userId, productId } = request.body;

        if (!userId || !productId)
            response
                .status(400)
                .json({ message: "userId and productId are required" });

        try {
            return await this.cartService.removeItemFromCart(userId, productId);
        } catch (error) {
            next(error);
        }
    }

    @httpPut("/update-quantity")
    public async updateQuantity(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        const { userId, item } = request.body;

        if (!userId || !item) {
            response.status(400).json({ message: "userId, item are required" });
        }

        try {
            console.log(request.body);
            return await this.cartService.updateItemQuantity(userId, item);
        } catch (error) {
            next(error);
        }
    }
}
