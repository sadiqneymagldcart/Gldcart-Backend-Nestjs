import mongoose, { Document, Schema } from "mongoose";

interface RentingAttributes {
    [key: string]: string;
}

export interface Renting extends Document {
    title: string;
    renting_name: string;
    price: number;
    description?: string;
    images?: string[];
    category: string;
    subcategory: string;
    attributes: RentingAttributes;
}

export const RentingSchema = new Schema<Renting>({
    title: {
        type: String,
        required: true,
    },
    renting_name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    images: {
        type: [String],
        required: false,
    },
    category: {
        type: String,
        required: true,
    },
    subcategory: {
        type: String,
        required: true,
    },
    attributes: {
        type: Schema.Types.Mixed,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});

RentingSchema.index({
    renting_name: "text",
    category: "text",
    subcategory: "text",
    attributes: "text",
});

export const RentingModel = mongoose.model<Renting>("Renting", RentingSchema);
