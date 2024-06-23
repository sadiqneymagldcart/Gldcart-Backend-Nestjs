import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({timestamps: true})
export class Review {
    @Prop({type: Types.ObjectId, ref: 'Offering', required: true})
    offering: Types.ObjectId;

    @Prop({required: true})
    user: string;

    @Prop({required: true})
    rating: number;

    @Prop({required: true})
    comment: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// Adding indexes
ReviewSchema.index({offering: 1});
ReviewSchema.index({user: 1});
