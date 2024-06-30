import * as express from "express";
import { inject } from "inversify";
import { CartService } from "@services/shop/cart.service";
import {
    controller,
    httpGet,
    httpPut,
    httpPost,
    httpDelete,
    BaseHttpController,
} from "inversify-express-utils";
import { AuthenticationMiddleware } from "@middlewares/authentication.middleware";

@controller("/cart", AuthenticationMiddleware)
export class CartController extends BaseHttpController {
    private readonly cartService: CartService;

    public constructor(@inject(CartService) cartService: CartService) {
        super();
        this.cartService = cartService;
    }

    @httpPost("/")
    public async createCart(request: express.Request) {
        const { userId } = request.body;

        if (!userId) return this.badRequest("User's ID is required");

        const cart = await this.cartService.createCart(userId);
        return this.json(cart);
    }

    @httpDelete("/")
    public async deleteCart(request: express.Request) {
        const { userId } = request.body;

        if (!userId) return this.badRequest("User ID is required");

        const result = await this.cartService.deleteCart(userId);
        return this.json(result);
    }

    @httpGet("/user/:userId")
    public async getCart(request: express.Request) {
        const { userId } = request.params;

        if (!userId) return this.badRequest("User ID is required");

        const cartItems = await this.cartService.getCartItems(userId);
        return this.json(cartItems);
    }

    @httpPost("/add-item")
    public async addItem(request: express.Request) {
        const { userId, item } = request.body;

        if (!userId || !item)
            return this.badRequest("User ID and item are required");

        const cartItem = await this.cartService.addItemToCart(userId, item);
        return this.json(cartItem);
    }

    @httpDelete("/remove-item")
    public async removeItem(request: express.Request) {
        const { userId, productId } = request.body;

        if (!userId || !productId)
            return this.badRequest("User ID and product ID are required");

        const result = await this.cartService.removeItemFromCart(userId, productId);
        return this.json(result);
    }

    @httpPut("/update-quantity")
    public async updateQuantity(request: express.Request) {
        const { userId, item } = request.body;

        if (!userId || !item)
            return this.badRequest("User ID and item are required");

        const updatedItem = await this.cartService.updateItemQuantity(userId, item);
        return this.json(updatedItem);
    }
}
