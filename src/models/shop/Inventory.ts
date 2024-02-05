import mongoose, {Document, Schema} from "mongoose";

export interface Inventory extends Document {
    product_id: Schema.Types.ObjectId;
    quantity: number;
}

const InventorySchema = new Schema<Inventory>({
    product_id: {
        type: Schema.Types.ObjectId,
        ref: "Products",
    },
    quantity: {
        type: Number,
        required: true,
    },
});

export const InventoryModel = mongoose.model<Inventory>(
    "Inventory",
    InventorySchema,
);
