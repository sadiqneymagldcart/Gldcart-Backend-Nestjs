import mongoose, { Schema } from "mongoose";

export interface Cart extends Document {
    userId: Schema.Types.ObjectId;
    items: CartItem[];
    total: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CartItem {
    productId: Schema.Types.ObjectId;
    quantity: number;
    price: number;
    total: number;
    createdAt: Date;
    updatedAt: Date;
}

const CartItemSchema = new Schema<CartItem>({
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export const cartSchema = new Schema<Cart>({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    items: [CartItemSchema],
    total: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export const CartModel = mongoose.model<Cart>("Cart", cartSchema);
