import mongoose, { Document, Model, Schema } from "mongoose";

export interface Order extends Document {
    user: mongoose.Types.ObjectId;
    payment_id: string;
    products: string[];
    subtotal: number;
    total: number;
    shipping?: object;
    status: string;
}

const orderSchema = new Schema<Order>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        payment_id: { type: String },
        products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
        subtotal: { type: Number, required: true },
        total: { type: Number, required: true },
        shipping: { type: Object },
        status: {
            type: String,
            enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true },
);

const OrderModel = mongoose.model("Order", orderSchema) as Model<Order>;

export default OrderModel;
