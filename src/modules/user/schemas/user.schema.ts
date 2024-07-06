import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
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
  @Transform(({ value }) => value.trim())
  name: string;

  @Prop()
  @Transform(({ value }) => value?.trim())
  surname?: string;

  @Prop({
    required: [true, 'email field is required'],
    unique: true,
    validate: [IsEmail, 'Invalid email format'],
    index: true,
  })
  email: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }] })
  addresses: Address;

  @Prop()
  picture?: string;

  @Prop({
    required: [true, 'password field is required'],
    minlength: [6, 'Minimum password length is 6 characters'],
  })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Prop({ type: [String] })
  wishlist: string[];

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
