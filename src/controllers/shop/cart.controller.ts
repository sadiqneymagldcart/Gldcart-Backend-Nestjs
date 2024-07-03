import * as express from "express";
import { inject } from "inversify";
import { CartService } from "@services/shop/cart.service";
import {
    controller,
    httpGet,
    httpPut,
    httpPost,
    httpDelete,
} from "inversify-express-utils";
import { requireAuth } from "@middlewares/auth.middleware";

@controller("/cart")
export class CartController {
    private readonly cartService: CartService;
    public constructor(@inject(CartService) cartService: CartService) {
        this.cartService = cartService;
    }

    @httpPost("/", requireAuth)
    public async createCart(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            if (!request.body.userId)
                return response.status(400).json({ message: "userId is required" });
            const cart = await this.cartService.createCart(request.body);
            response.status(201).json(cart);
        } catch (error) {
            next(error);
        }
    }

    @httpDelete("/", requireAuth)
    public async deleteCart(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            if (!request.body.userId)
                return response.status(400).json({ message: "userId is required" });
            const cart = await this.cartService.deleteCart(request.body.userId);
            response.status(200).json(cart);
        } catch (error) {
            next(error);
        }
    }
    // TODO: Add auth middleware to this route
    @httpGet("/user/:userId")
    public async getCart(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        if (!request.params.userId)
            return response.status(400).json({ message: "userId is required" });
        try {
            const cart = await this.cartService.getCartItems(request.params.userId);
            response.status(200).json(cart);
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
            const cart = await this.cartService.addItemToCart(
                request.body.userId,
                request.body.item,
            );
            response.status(201).json(cart);
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
            const cart = await this.cartService.removeItemFromCart(
                request.body.userId,
                request.body.productId,
            );
            response.status(200).json(cart);
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
            response
              .status(400)
              .json({ message: "userId, item are required" });
        }
        try {
            console.log(request.body);
            const cart = await this.cartService.updateItemQuantity(
              request.body.userId,
              request.body.item,
            );
            response.status(200).json(cart);
        } catch (error) {
            next(error);
        }
    }
}
