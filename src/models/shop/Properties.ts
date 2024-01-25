import {Document} from 'mongoose';

export interface IProperties extends Document {
    name: string;
    value: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
