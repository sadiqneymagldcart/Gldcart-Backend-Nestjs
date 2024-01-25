import {Document, Schema} from "mongoose";

export interface ICategory extends Document {
    id: string;
    name: string;
    parent_category: Schema.Types.ObjectId;
}

export const CategorySchema = new Schema<ICategory>({
    name: {
        type: String,
        required: true,
    },
    parent_category: {
        type: Schema.Types.ObjectId,
        ref: "Categories",
    },
});
