import mongoose, { Schema } from "mongoose";
import { Product } from "../product/Product";

export interface Wishlist extends Document {
    userId: Schema.Types.ObjectId;
    items: WishlistItem[];
}

export interface WishlistItem {
    productId: Product;
}

const wishlistItemSchema = new Schema<WishlistItem>(
    {
        productId: { type: Schema.Types.ObjectId, ref: "Product", unique: true},
    },
);

export const wishlistSchema = new Schema<Wishlist>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        items: [wishlistItemSchema],
    },
);

export const WishlistModel = mongoose.model<Wishlist>(
    "Wishlist",
    wishlistSchema,
);
