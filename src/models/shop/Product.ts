import mongoose, {Document, Model, Schema} from "mongoose";

export interface Product extends Document {
    name: string;
    short_description?: string;
    long_description?: string;
    price: number;
    images: string[];
    manufacturer?: string;
    category_id: Schema.Types.ObjectId;
    quantity: number;
    attributes: Map<string, string>;
}

export const ProductSchema = new Schema<Product>({
    name: {type: String, required: true, trim: true},
    short_description: {type: String, trim: true},
    long_description: {type: String, trim: true},
    price: {type: Number, required: true},
    images: [{type: String}],
    manufacturer: {type: String, trim: true},
    category_id: {type: Schema.Types.ObjectId, ref: "Category", required: true},
    quantity: {type: Number, required: true, default: 0},
    attributes: {type: Map, of: String, required: true},
});

ProductSchema.index({
    name: "text",
    short_description: "text",
    long_description: "text",
    manufacturer: "text",
    quantity: "text",
    attributes: "text",
});

export const ProductModel = mongoose.model(
    "Product",
    ProductSchema,
) as Model<Product>;
