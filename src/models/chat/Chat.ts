import mongoose, { Document, Schema } from "mongoose";

export interface Chat extends Document {
    participants: string[];
}

const chatSchema = new Schema<Chat>(
    {
        participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true },
);

chatSchema.index({ participants: 1 });

export const ChatModel = mongoose.model("Chat", chatSchema);
