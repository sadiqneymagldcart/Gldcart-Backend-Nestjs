import mongoose, { Document, Schema } from "mongoose";

export interface Chat extends Document {
    participants: string[];
    messages: string[];
}

const chatSchema = new Schema<Chat>(
    {
        participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
        messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    },
    { timestamps: true },
);

chatSchema.index({ participants: 1, messages: 1 });

export const ChatModel = mongoose.model("Chat", chatSchema);
