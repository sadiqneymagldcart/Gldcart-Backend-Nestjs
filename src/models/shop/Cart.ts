import mongoose, {Document, Model, Schema} from "mongoose";

interface Cart extends Document {
    user: mongoose.Types.ObjectId;
    cartItems: CartItem[];
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}

interface CartItem {
    product: Schema.Types.ObjectId;
    quantity: number;
    price: number;
}

const cartItemSchema = new Schema<CartItem>(
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

const cartSchema = new Schema<Cart>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        cartItems: [cartItemSchema],
        totalPrice: { type: Number, required: true },
    },
    { timestamps: true },
);

const CartModel = mongoose.model("Cart", cartSchema) as Model<Cart>;
export {Cart, CartItem, CartModel};
