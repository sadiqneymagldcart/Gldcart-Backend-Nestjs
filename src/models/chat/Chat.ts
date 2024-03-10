import mongoose, { Model, Schema } from "mongoose";

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

export const ChatModel = mongoose.model("Chat", chatSchema) as Model<Chat>;
