import * as express from "express";
import { inject } from "inversify";
import { CartService } from "../../services/shop/cart.service";
import {
    controller,
    httpGet,
    httpPost,
    httpPut,
    httpDelete,
} from "inversify-express-utils";
import { requireAuth } from "../../middlewares/auth.middleware";

@controller("/cart")
export class CartController {
    private readonly cartService: CartService;
    public constructor(@inject(CartService) cartService: CartService) {
        this.cartService = cartService;
    }

    @httpPost("/", requireAuth)
    public async createCartHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const cart = await this.cartService.createCart(request.body);
            response.status(201).json(cart);
        } catch (error) {
            next(error);
        }
    }

    @httpPut("/", requireAuth)
    public async updateCartHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const cart = await this.cartService.updateCart(
                request.body.userId,
                request.body,
            );
            response.status(200).json(cart);
        } catch (error) {
            next(error);
        }
    }

    @httpDelete("/", requireAuth)
    public async deleteCartHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const cart = await this.cartService.deleteCart(request.body.userId);
            response.status(200).json(cart);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/:cartId", requireAuth)
    public async getCartByIdHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const cart = await this.cartService.getCartById(request.params.cartId);
            response.status(200).json(cart);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/user/:userId")
    public async getCartByUserIdHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const cart = await this.cartService.getCartByUserId(
                request.params.userId,
            );
            response.status(200).json(cart);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/add-item")
    public async addItemToCartHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const cart = await this.cartService.addItemToCart(
                request.body.userId,
                request.body.item,
            );
            response.status(200).json(cart);
        } catch (error) {
            next(error);
        }
    }

    @httpPut("/update-item", requireAuth)
    public async updateCartItemHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const cart = await this.cartService.updateCartItem(
                request.body.userId,
                request.body.itemId,
                request.body.item,
            );
            response.status(200).json(cart);
        } catch (error) {
            next(error);
        }
    }

    @httpDelete("/remove-item")
    public async removeItemFromCartHandler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
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
}
