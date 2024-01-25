import {Document, Schema} from "mongoose";

export interface IReviews extends Document {
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

export const ReviewsSchema = new Schema<IReviews>(
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
