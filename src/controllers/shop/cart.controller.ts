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
import { authMiddleware } from "@middlewares/auth.middleware";

@controller("/cart", authMiddleware)
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
        if (!request.body.userId)
            return response.status(400).json({ message: "userId is required" });
        try {
            return await this.cartService.createCart(request.body);
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
        if (!request.body.userId)
            return response.status(400).json({ message: "userId is required" });
        try {
            return await this.cartService.deleteCart(request.body.userId);
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
        if (!request.params.userId)
            return response.status(400).json({ message: "userId is required" });
        try {
            return await this.cartService.getCartItems(request.params.userId);
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
        if (!request.body.userId || !request.body.item)
            return response
                .status(400)
                .json({ message: "userId and item are required" });
        try {
            return await this.cartService.addItemToCart(
                request.body.userId,
                request.body.item,
            );
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
        if (!request.body.userId || !request.body.productId) {
            response
                .status(400)
                .json({ message: "userId and productId are required" });
        }
        try {
            return await this.cartService.removeItemFromCart(
                request.body.userId,
                request.body.productId,
            );
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
        if (!request.body.userId || !request.body.item) {
            response.status(400).json({ message: "userId, item are required" });
        }
        try {
            console.log(request.body);
            return await this.cartService.updateItemQuantity(
                request.body.userId,
                request.body.item,
            );
        } catch (error) {
            next(error);
        }
    }
}
