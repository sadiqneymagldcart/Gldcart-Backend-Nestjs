import mongoose, { Document, Schema } from 'mongoose';

interface RentingAttributes {
    [key: string]: string;
}

export interface Renting extends Document {
    renting_name: string;
    description?: string;
    images: string[];
    category: string;
    subcategory: string;
    attributes: RentingAttributes;
}

export const RentingSchema = new Schema<Renting>({
    renting_name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    images: {
        type: [String],
        required: true,
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
});

RentingSchema.index({
    renting_name: 'text',
    category: 'text',
    subcategory: 'text',
});

export const RentingModel = mongoose.model<Renting>(
    'Renting',
    RentingSchema,
);
