import {NextFunction, Request, Response} from "express";
import {inject} from "inversify";
import {CartService} from "../../services/shop/cart.service";
import {controller, httpDelete, httpGet, httpPost} from "inversify-express-utils";
import {requireAuth} from "../../middlewares/auth.middleware";

@controller("/cart")
export class CartController {
    private readonly cartService: CartService;

    constructor(@inject(CartService) cartService: CartService) {
        this.cartService = cartService;
    }

    @httpGet("/:cartId", requireAuth)
    public async getCartItemsHandler(req: Request, res: Response, next: NextFunction) {
        const {cartId} = req.params;
        try {
            const cartItems = await this.cartService.getCartItems(cartId);
            res.status(200).json({cartItems: cartItems});
        } catch (error: any) {
            next(error);
        }
    }

    @httpPost("/add", requireAuth)
    public async addCartItemHandler(req: Request, res: Response, next: NextFunction) {
        const {userId, productId, quantity} = req.body;
        if (typeof userId !== "string" || typeof productId !== "string" || typeof quantity !== "number") {
            return next(new Error("Invalid request parameters. The userId and productId should be strings and quantity should be a number"));
        }
        try {
            const cart = await this.cartService.addCartItem(userId, productId, quantity);
            res.status(200).json({message: "Item added to cart", cart});
        } catch (error: any) {
            next(error);
        }
    }

    @httpDelete("/:cartId/:itemId", requireAuth)
    public async removeCartItemHandler(req: Request, res: Response, next: NextFunction) {
        try {
            const {cartId, itemId} = req.params;
            const cart = await this.cartService.removeItem(cartId, itemId);
            res.status(200).json({message: "Item deleted from cart", cart});
        } catch (error: any) {
            next(error);
        }
    }

    // @httpPut("/update")
    // public async updateCartItemHandler(req: Request, res: Response, next: NextFunction) {
    //     const {cartId, itemId, quantity} = req.body;
    //     if (typeof cartId !== "string" || typeof itemId !== "string" || typeof quantity !== "number") {
    //         return next(new Error("Invalid request parameters. The cartId and itemId should be strings and quantity should be a number"));
    //     }
    //     try {
    //         const cart = await this.cartService.updateItem(cartId, itemId, quantity);
    //         res.status(200).json({message: "Item updated in cart", cart});
    //     } catch (error: any) {
    //         next(error);
    //     }
    // }
    // @httpDelete("/clear/:cartId")
    // public async clearCartHandler(req: Request, res: Response, next: NextFunction) {
    //     const {cartId} = req.params;
    //     try {
    //         const cart = await this.cartService.clearCart(cartId);
    //         res.status(200).json({message: "Cart cleared", cart});
    //     } catch (error: any) {
    //         next(error);
    //     }
    // }
}
