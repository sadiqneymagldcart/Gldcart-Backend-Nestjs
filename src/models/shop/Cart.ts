import mongoose, { Document, Model, Schema } from "mongoose";

interface ICart extends Document {
    user: mongoose.Types.ObjectId;
    cartItems: ICartItem[];
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}

interface ICartItem {
    product: Schema.Types.ObjectId;
    quantity: number;
    price: number;
}

const cartItemSchema = new Schema<ICartItem>(
    {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 1, required: true },
        price: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const cartSchema = new Schema<ICart>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        cartItems: [cartItemSchema],
        totalPrice: { type: Number, required: true },
    },
    { timestamps: true },
);

const Cart = mongoose.model("Cart", cartSchema) as Model<ICart>;
export { ICart, ICartItem, Cart };
