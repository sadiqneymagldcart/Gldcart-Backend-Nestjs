import mongoose, { Schema } from "mongoose";

export interface Cart extends Document {
    userId: Schema.Types.ObjectId;
    items: CartItem[];
    total: number;
}

export interface CartItem {
    product: Schema.Types.ObjectId;
    quantity: number;
    price: number;
    total: number;
}

const cartItemSchema = new Schema<CartItem>(
    {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
        total: { type: Number, required: true },
    },
    { timestamps: true },
);

export const cartSchema = new Schema<Cart>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        items: [cartItemSchema],
        total: { type: Number, required: false },
    },
    { timestamps: true },
);

export const CartModel = mongoose.model<Cart>("Cart", cartSchema);
