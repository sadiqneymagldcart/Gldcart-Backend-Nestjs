import {model, Schema} from "mongoose";

export interface Subcategory {
    name: string;
    category_id: Schema.Types.ObjectId;
}

export const SubcategorySchema = new Schema<Subcategory>({
    name: {type: String, required: true, trim: true},
    category_id: {type: Schema.Types.ObjectId, ref: "Category", required: true},
});

export const SubcategoryModel = model<Subcategory>("Subcategory", SubcategorySchema);
