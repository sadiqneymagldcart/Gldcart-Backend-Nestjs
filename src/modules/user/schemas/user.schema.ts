import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { UserRole } from '@user/enums/roles.enum';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({ description: 'The unique identifier of the user' })
  @Transform(({ value }) => value.toString())
  _id: string;

  @ApiProperty({
    description: 'The role of the user',
    enum: UserRole,
    example: UserRole.BUYER,
  })
  @Prop({
    required: [true, 'role field is required'],
    enum: UserRole,
    index: true,
  })
  role: UserRole;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @Prop({
    required: [true, 'name field is required'],
  })
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiPropertyOptional({
    description: 'The surname of the user',
    example: 'Doe',
  })
  @Prop()
  @Transform(({ value }) => value?.trim())
  surname?: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  @Prop({
    required: [true, 'email field is required'],
    unique: true,
    validate: [IsEmail, 'Invalid email format'],
    index: true,
  })
  email: string;

  // @ApiProperty({
  //   description: 'List of address IDs associated with the user',
  //   type: [String],
  // })
  // @Prop({ type: [{ type: Types.ObjectId, ref: 'Address' }] })
  // @IsArray()
  // addresses: Address[];

  @ApiPropertyOptional({
    description: 'The profile picture URL of the user',
    example: 'http://example.com/profile.jpg',
  })
  @Prop()
  picture?: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
    minLength: 6,
  })
  @Prop({
    required: [true, 'password field is required'],
    minlength: [6, 'Minimum password length is 6 characters'],
  })
  @Exclude({ toPlainOnly: true })
  password: string;

  @ApiProperty({
    description: "List of product IDs in the user's wishlist",
    type: [String],
  })
  @Prop({ type: [String] })
  wishlist: string[];

  @ApiHideProperty()
  @Prop()
  password_token?: string;

  @ApiPropertyOptional({
    description: 'The active subscription ID of the user',
    type: String,
    nullable: true,
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'Subscription',
    default: null,
  })
  active_subscription?: Types.ObjectId;

  @ApiPropertyOptional({
    description: 'A brief bio of the user',
    example: 'Software developer with 10 years of experience.',
  })
  @Prop()
  bio?: string;

  @ApiPropertyOptional({
    description: 'The phone number of the user',
    example: '+1234567890',
  })
  @Prop()
  phone_number?: string;

  @ApiPropertyOptional({
    description: 'The status of the user',
    example: 'active',
  })
  @Prop()
  status?: string;

  @ApiProperty({
    description: 'List of document image URLs associated with the user',
    type: [String],
  })
  @Prop({ type: [String] })
  document_images: string[];

  @ApiHideProperty()
  @Prop()
  verification_token?: string;

  @ApiProperty({
    description: "Indicates if the user's email is confirmed",
    example: false,
  })
  @Prop({ default: false })
  confirmed: boolean;

  @ApiProperty({
    description: 'Indicates if the user is verified',
    example: false,
  })
  @Prop({ default: false })
  verified: boolean;

  @ApiProperty({
    description: 'Indicates if the user is currently online',
    example: false,
  })
  @Prop({ default: false })
  is_online: boolean;

  @ApiPropertyOptional({ description: 'The stripe customer ID of the user' })
  @Prop()
  stripeCustomerId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
