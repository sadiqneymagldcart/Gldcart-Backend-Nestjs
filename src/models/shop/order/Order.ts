import mongoose, { Document, Model, Schema } from "mongoose";

export interface Order extends Document {
    user: mongoose.Types.ObjectId;
    products: string[];
    total: number;
    billing_details?: object;
    order_notes?: string;
    status: string;
}

const orderSchema = new Schema<Order>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
        total: { type: Number, required: true },
        billing_details: { type: Object },
        order_notes: { type: String },
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
