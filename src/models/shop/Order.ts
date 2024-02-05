import mongoose, {Document, Model, Schema} from "mongoose";
import {Product, ProductSchema} from "./Product";

export interface Order extends Document {
    user: mongoose.Types.ObjectId;
    products: Product[];
    subtotal: number;
    total: number;
    shipping?: object;
    delivery_status: string;
    payment_status: string;
}

const orderSchema: Schema<Order> = new Schema(
    {
        user: {type: Schema.Types.ObjectId, ref: 'User'},
        products: [ProductSchema],
        subtotal: {type: Number, required: true},
        total: {type: Number, required: true},
        shipping: {type: Object},
        delivery_status: {type: String, default: 'pending'},
        payment_status: {type: String, required: true},
    },
);

const OrderModel = mongoose.model('Order', orderSchema) as Model<Order>;

export default OrderModel;
