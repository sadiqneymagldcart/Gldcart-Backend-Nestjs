import mongoose, {Document, Schema} from 'mongoose';

interface WishList extends Document {
    user: mongoose.Types.ObjectId;
    products: mongoose.Types.ObjectId[];
}

const WishlistSchema = new Schema<WishList>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
});

export const WishlistModel = mongoose.model<WishList>('Wishlist', WishlistSchema);
