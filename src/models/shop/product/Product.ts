import mongoose, { Document, Model, Schema } from "mongoose";

interface ProductAttributes {
  [key: string]: string;
}

export interface Product extends Document {
  title: string;
  product_name: string;
  seller_id: Schema.Types.ObjectId | string;
  price: number;
  stock: number;
  description?: string;
  images: string[];
  category: string;
  subcategory: string;
  attributes: ProductAttributes;
  reviews?: string[];
  rating?: number;
}

export const ProductSchema = new Schema<Product>({
  title: { type: String, required: true, trim: true },
  product_name: { type: String, required: true, trim: true },
  seller_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  price: { type: Number, required: false },
  stock: { type: Number, required: true },
  category: { type: String, required: true, trim: true },
  subcategory: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  images: [{ type: String }, { required: true }],
  attributes: { type: Schema.Types.Mixed, required: true },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  rating: { type: Number },
});

ProductSchema.index({
  title: "text",
  product_name: "text",
  category: "text",
  subcategory: "text",
  attributes: "text",
});

export const ProductModel = mongoose.model(
  "Product",
  ProductSchema,
) as Model<Product>;
