import mongoose, {Document, Model, Schema} from "mongoose";

export interface IProduct extends Document {
    name: string;
    short_description?: string;
    long_description?: string;
    price: number;
    images: string[];
    manufacturer?: string;
    category_id: Schema.Types.ObjectId;
    quantity: number;
}

export const productSchema = new Schema<IProduct>({
    name: {type: String, required: true},
    short_description: {type: String},
    long_description: {type: String},
    price: {type: Number, required: true},
    images: {type: [String], required: true},
    manufacturer: {type: String},
    category_id: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
    quantity: {type: Number, required: true, default: 1},
});

const Product = mongoose.model('Product', productSchema) as Model<IProduct>;
mongoose.connection.collections['products'].createIndex({
    name: 'text',
    short_description: 'text',
    long_description: 'text',
    manufacturer: 'text'
});

export default Product;
