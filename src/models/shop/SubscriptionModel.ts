import mongoose, {Document, Schema} from 'mongoose';

export interface Subscription extends Document {
    type: string;
    duration: number;
    price: number;
}

const subscriptionSchema = new Schema<Subscription>({
    type: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
});

const SubscriptionModel = mongoose.model<Subscription>('Subscription', subscriptionSchema);
export default SubscriptionModel;
