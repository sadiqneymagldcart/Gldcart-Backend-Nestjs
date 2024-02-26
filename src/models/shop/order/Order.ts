import mongoose, { Document, Model, Schema } from "mongoose";
import { Product, ProductSchema } from "../product/Product";

export interface Order extends Document {
    user: mongoose.Types.ObjectId;
    products: string[];
    subtotal: number;
    total: number;
    shipping?: object;
    delivery_status: string;
    payment_status: string;
}

const orderSchema = new Schema<Order>({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    shipping: { type: Object },
    delivery_status: { type: String, default: "pending" },
    payment_status: { type: String, default: "pending" },
});

const OrderModel = mongoose.model("Order", orderSchema) as Model<Order>;

export default OrderModel;
