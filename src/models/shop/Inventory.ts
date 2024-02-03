import mongoose, {Document, Schema} from "mongoose";

export interface IInventory extends Document {
    product_id: Schema.Types.ObjectId;
    quantity: number;
}

export const InventorySchema = new Schema<IInventory>({
    product_id: {
        type: Schema.Types.ObjectId,
        ref: "Products",
    },
    quantity: {
        type: Number,
        required: true,
    },
});

export const Inventory = mongoose.model<IInventory>("Inventory", InventorySchema);
