import mongoose, {Document, Model, Schema} from "mongoose";

export interface IProduct extends Document {
    sku: string;
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
    sku: {type: String, required: true, unique: true, trim: true},
    name: {type: String, required: true, trim: true},
    short_description: {type: String, trim: true},
    long_description: {type: String, trim: true},
    price: {type: Number, required: true},
    images: {type: [String], required: true},
    manufacturer: {type: String, trim: true},
    category_id: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
    quantity: {type: Number, required: true, default: 1},
});

productSchema.index({
    sku: 'text',
    name: 'text',
    short_description: 'text',
    long_description: 'text',
    manufacturer: 'text',
});

const Product = mongoose.model('Product', productSchema) as Model<IProduct>;

export default Product;
