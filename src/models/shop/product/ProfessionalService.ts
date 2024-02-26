import mongoose, { Document, Schema } from "mongoose";

interface ServiceAttributes {
    [key: string]: string;
}

export interface ProfessionalService extends Document {
    service_name: string;
    description?: string;
    images: string[];
    category: string;
    subcategory: string;
    attributes: ServiceAttributes;
}

export const ProfessionalServiceSchema = new Schema<ProfessionalService>({
    service_name: {
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

ProfessionalServiceSchema.index({
    service_name: "text",
    category: "text",
    subcategory: "text",
    attributes: "text",
});

export const ServicesModel = mongoose.model<ProfessionalService>(
    "ProfessionalService",
    ProfessionalServiceSchema,
);
