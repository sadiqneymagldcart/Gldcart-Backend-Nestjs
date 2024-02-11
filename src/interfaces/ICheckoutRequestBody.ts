import {Product} from "../models/shop/product/Product";

export interface ICheckoutRequestBody {
    userId: string;
    cartItems: Product[];
}
