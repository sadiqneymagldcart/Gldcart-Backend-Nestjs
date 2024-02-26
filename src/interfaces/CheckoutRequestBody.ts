import { CartItem } from "../models/shop/cart/Cart";

export interface CheckoutRequestBody {
    userId: string;
    cartItems: CartItem[];
}
