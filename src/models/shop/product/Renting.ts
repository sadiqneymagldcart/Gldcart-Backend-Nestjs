import mongoose, { Document, Schema } from "mongoose";

interface IRentingAttributes {
    [key: string]: string;
}

interface IRenting extends Document {
    title: string;
    renting_name: string;
    price: number;
    description?: string;
    images?: string[];
    category: string;
    subcategory: string;
    attributes: IRentingAttributes;
}

const RentingSchema = new Schema<IRenting>({
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

const RentingModel = mongoose.model<IRenting>("Renting", RentingSchema);

export { IRenting, RentingModel };
