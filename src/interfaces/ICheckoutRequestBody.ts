import {IProduct} from "../models/shop/Product";

export interface ICheckoutRequestBody {
    userId: string;
    cartItems: IProduct[];
}
