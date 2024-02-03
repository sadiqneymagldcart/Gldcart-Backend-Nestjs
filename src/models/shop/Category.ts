import mongoose, {Document, Schema} from "mongoose";

export interface ICategory extends Document {
    name: string;
    description?: string;
}

export const categorySchema = new Schema<ICategory>({
    name: {type: String, required: true, trim: true, unique: true},
    description: {type: String, trim: true}
});

export default mongoose.model<ICategory>('Category', categorySchema);