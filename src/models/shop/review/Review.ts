import mongoose, { Schema } from "mongoose";

export interface Review extends Document {
    user: Schema.Types.ObjectId;
    product: Schema.Types.ObjectId;
    rating: number;
    review: string;
}

const ReviewSchema = new Schema<Review>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
        required: true,
    },
});

export const ReviewModel = mongoose.model<Review>("Review", ReviewSchema);
