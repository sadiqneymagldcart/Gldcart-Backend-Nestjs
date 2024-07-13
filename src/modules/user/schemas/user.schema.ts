import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import { UserRole } from '@user/enums/roles.enum';
import { Address } from '@address/schemas/address.schema';
import mongoose from 'mongoose';

export type UserDocument = User & mongoose.Document;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: [true, 'role field is required'],
    enum: UserRole,
    index: true,
  })
  role: UserRole;

  @Prop({
    required: [true, 'name field is required'],
  })
  name: string;

  @Prop()
  surname?: string;

  @Prop({
    required: [true, 'email field is required'],
    unique: true,
    validate: [IsEmail, 'Invalid email format'],
    index: true,
  })
  email: string;

  @Prop({})
  address?: string;

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }] })
  // delivery_addresses: DeliveryAddress[];

  @Prop()
  profile_picture?: string;

  @Prop({
    required: [true, 'password field is required'],
    minlength: [6, 'Minimum password length is 6 characters'],
  })
  password: string;

  @Prop()
  password_token?: string;

  @Prop()
  bio?: string;

  @Prop()
  phone_number?: string;

  @Prop()
  status?: string;

  @Prop({ type: [String] })
  document_images: string[];

  @Prop()
  verification_token?: string;

  @Prop({ default: false })
  confirmed: boolean;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ default: false })
  is_online: boolean;

  @Prop()
  stripeCustomerId: string;

  @Prop({ nullable: true })
  monthlySubscriptionStatus?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
