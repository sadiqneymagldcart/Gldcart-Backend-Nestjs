import mongoose, { Schema } from "mongoose";

export interface Wishlist extends Document {
    userId: Schema.Types.ObjectId;
    items: WishlistItem[];
}

export interface WishlistItem {
    productId: Schema.Types.ObjectId;
}

const wishlistItemSchema = new Schema<WishlistItem>(
    {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
    },
    { timestamps: true },
);

export const wishlistSchema = new Schema<Wishlist>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        items: [wishlistItemSchema],
    },
    { timestamps: true },
);

export const WishlistModel = mongoose.model<Wishlist>(
    "Wishlist",
    wishlistSchema,
);
