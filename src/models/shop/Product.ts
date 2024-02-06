import mongoose, { Document, Model, Schema } from "mongoose";

export interface Product extends Document {
    product_name: string;
    description?: string;
    images: string[];
    category: string;
    subcategory: string;
    attributes: Record<string, any>;
}

export const ProductSchema = new Schema<Product>({
    product_name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    subcategory: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    images: [{ type: String }],
    attributes: { type: Schema.Types.Mixed, required: true },
});

ProductSchema.index({
    name: "text",
    category: "text",
    subcategory: "text",
    manufacturer: "text",
});

export const ProductModel = mongoose.model(
    "Product",
    ProductSchema,
) as Model<Product>;
