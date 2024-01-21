import { IProduct } from "../models/Product";

export interface ICheckoutRequestBody {
    userId: string;
    cartItems: IProduct[];
}

