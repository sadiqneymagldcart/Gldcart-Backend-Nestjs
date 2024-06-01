import mongoose, { Document, Schema } from "mongoose";

interface IServiceAttributes {
    [key: string]: string;
}

interface IProfessionalService extends Document {
    service_name: string;
    description?: string;
    images: string[];
    category: string;
    subcategory: string;
    attributes: IServiceAttributes;
}

const ProfessionalServiceSchema = new Schema<IProfessionalService>({
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

const ServicesModel = mongoose.model<IProfessionalService>(
    "ProfessionalService",
    ProfessionalServiceSchema,
);

export { IProfessionalService, ServicesModel };
