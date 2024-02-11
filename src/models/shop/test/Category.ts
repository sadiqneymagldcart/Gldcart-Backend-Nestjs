import mongoose, {Document, Model, Schema} from "mongoose";

export interface Category extends Document {
    name: string;
    description?: string;
}

export const CategorySchema = new Schema<Category>({
    name: {type: String, required: true, trim: true, unique: true},
    description: {type: String, trim: true},
});

export const CategoryModel = mongoose.model<Category>("Category", CategorySchema) as Model<Category>;
