import mongoose, { Schema, Document } from "mongoose";
import { IProduct } from "../product/Product";

interface IWishlist extends Document {
    userId: Schema.Types.ObjectId;
    items: IWishlistItem[];
}

interface IWishlistItem {
    product: IProduct;
}

const wishlistItemSchema = new Schema<IWishlistItem>({
    product: { type: Schema.Types.ObjectId, ref: "Product" },
});

const wishlistSchema = new Schema<IWishlist>({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    items: [wishlistItemSchema],
});

const WishlistModel = mongoose.model<IWishlist>("Wishlist", wishlistSchema);

export { IWishlist, IWishlistItem, WishlistModel };
