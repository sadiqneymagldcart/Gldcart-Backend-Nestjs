import mongoose, {  Document, Schema } from "mongoose";

interface ISubscription extends Document {
  type: string;
  duration: number;
  price: number;
}

const subscriptionSchema = new Schema<ISubscription>({
  type: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
});

const SubscriptionModel = mongoose.model<ISubscription>(
  "Subscription",
  subscriptionSchema,
);

export { ISubscription, SubscriptionModel };
