import mongoose, { Schema, Document } from "mongoose";
import { IProduct } from "../product/Product";

interface ICart extends Document {
    userId: Schema.Types.ObjectId;
    items: ICartItem[];
}

interface ICartItem {
    _id?: string;
    product: IProduct;
    quantity: number;
}

const cartItemSchema = new Schema<ICartItem>(
    {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number },
    },
    { timestamps: true },
);

const cartSchema = new Schema<ICart>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        items: [cartItemSchema],
    },
    { timestamps: true },
);

const CartModel = mongoose.model<ICart>("Cart", cartSchema);

export { ICart, ICartItem, CartModel };
