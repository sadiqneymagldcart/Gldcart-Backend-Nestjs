import mongoose, { Schema } from "mongoose";

interface IChat extends Document {
    participants: string[];
}

const chatSchema = new Schema<IChat>(
    {
        participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true },
);

chatSchema.index({ participants: 1 });

const ChatModel = mongoose.model("Chat", chatSchema);

export { IChat, ChatModel };
