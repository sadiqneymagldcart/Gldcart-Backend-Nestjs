import mongoose, { Document, Model, Schema } from "mongoose";

interface ProductAttributes {
  [key: string]: string;
}

export interface Product extends Document {
  product_name: string;
  price: number;
  stock: number;
  description?: string;
  images?: string[];
  category: string;
  subcategory: string;
  attributes: ProductAttributes;
  reviews?: string[];
}

export const ProductSchema = new Schema<Product>({
  product_name: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true, trim: true },
  subcategory: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  images: [{ type: String }],
  attributes: { type: Schema.Types.Mixed, required: true },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

ProductSchema.index({
  product_name: "text",
  category: "text",
  subcategory: "text",
  attributes: "text",
});

export const ProductModel = mongoose.model(
  "Product",
  ProductSchema,
) as Model<Product>;
