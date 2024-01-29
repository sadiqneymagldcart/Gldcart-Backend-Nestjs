import mongoose, {Document, Schema} from "mongoose";

export interface IReview extends Document {
    _id: string;
    name: string;
    review: string;
    rating: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    deleted: boolean;
    user: Schema.Types.ObjectId;
    product: Schema.Types.ObjectId;
}

export const ReviewSchema = new Schema<IReview>(
    {
        name: {
            type: String,
            required: true,
        },
        review: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "Users",
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: "Products",
        },
    },
    {
        timestamps: true,
    },
);
export const Review = mongoose.model<IReview>("Review", ReviewSchema);
