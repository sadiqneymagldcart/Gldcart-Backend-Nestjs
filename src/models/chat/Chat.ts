import mongoose, { Schema } from "mongoose";
import {IChat} from "@interfaces/IChat";

const chatSchema = new Schema<IChat>(
    {
        participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true },
);

chatSchema.index({ participants: 1 });

export const ChatModel = mongoose.model("Chat", chatSchema);
