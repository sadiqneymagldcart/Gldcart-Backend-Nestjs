import {Product} from "../models/shop/Product";

export interface ICheckoutRequestBody {
    userId: string;
    cartItems: Product[];
}
