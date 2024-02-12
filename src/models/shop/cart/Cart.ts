import mongoose, { Schema } from "mongoose";

export interface Cart extends Document {
    userId: Schema.Types.ObjectId;
    items: CartItem[];
    total: number;
}

export interface CartItem {
    productId: Schema.Types.ObjectId;
    quantity: number;
    price: number;
    total: number;
}

const CartItemSchema = new Schema<CartItem>(
    {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: false },
        total: { type: Number, required: false },
    },
    { timestamps: true },
);

export const cartSchema = new Schema<Cart>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        items: [CartItemSchema],
        total: { type: Number, required: false },
    },
    { timestamps: true },
);

export const CartModel = mongoose.model<Cart>("Cart", cartSchema);
