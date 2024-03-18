import mongoose, { Document, Model, Schema } from "mongoose";

export interface Order extends Document {
    user: mongoose.Types.ObjectId;
    products: string[];
    total: number;
    shipping?: object;
    status: string;
}

const orderSchema = new Schema<Order>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
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
