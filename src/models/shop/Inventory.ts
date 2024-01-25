import {Document, Schema} from "mongoose";

export interface IInventory extends Document {
    product: Schema.Types.ObjectId;
    quantity: number;
}

export const InventorySchema = new Schema<IInventory>({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Products",
    },
    quantity: {
        type: Number,
        required: true,
    },
});
