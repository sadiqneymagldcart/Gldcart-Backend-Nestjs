import { CreateAddressDto } from '@address/dto/create-address.dto';
import { UpdateAddressDto } from '@address/dto/update-address.dto';
import { AddressDocument } from '@address/schemas/address.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Nullable } from '@shared/types/common';
import { StripeService } from '@stripe/services/stripe.service';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { User, UserDocument } from '@user/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly stripeService: StripeService,
  ) { }

  public async createUser(userData: CreateUserDto): Promise<User> {
    const stripeCustomer = await this.stripeService.createCustomer(
      userData.name,
      userData.email,
    );
    const user = await this.userModel.findOneAndUpdate(
      { email: userData.email },
      { ...userData, stripeCustomerId: stripeCustomer.id },
      { upsert: true, new: true },
    );
    return user;
  }

  public async updateUser(id: string, userData: UpdateUserDto): Promise<User> {
    const existingUser = await this.userModel.findByIdAndUpdate(id, userData, {
      new: true,
    });
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return existingUser;
  }

  public async getAllUsers(): Promise<User[]> {
    return this.userModel.find();
  }

  public async getUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  public async getUserByEmail(email: string): Promise<Nullable<User>> {
    return this.userModel.findOne({ email });
  }

  public async removeUser(id: string): Promise<void> {
    const result = await this.userModel.findOneAndDelete({ _id: id });
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  public async updateMonthlySubscriptionStatus(
    stripeCustomerId: string,
    monthlySubscriptionStatus: string,
  ) {
    return this.userModel.findOneAndUpdate(
      { stripeCustomerId },
      { monthlySubscriptionStatus },
      { new: true },
    );
  }

  public async retrieveStripeCustomerId(userId: string): Promise<string> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user.stripeCustomerId;
  }

  public async updateProfilePicture(userId: string, image: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    user.profile_picture = image;
    return user.save();
  }

  public async getShippingAddresses(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user.shipping_addresses;
  }

  public async addShippingAddress(
    userId: string,
    newAddress: CreateAddressDto,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    user.shipping_addresses.push(newAddress);
    return user.save().then((user) => user.shipping_addresses);
  }

  public async removeShippingAddress(userId: string, addressId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    user.shipping_addresses = user.shipping_addresses.filter(
      (address: AddressDocument) => address._id?.toString() !== addressId,
    );
    return user.save().then((user) => user.shipping_addresses);
  }

  public async updateShippingAddress(
    userId: string,
    addressId: string,
    updatedAddress: UpdateAddressDto,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const addressIndex = user.shipping_addresses.findIndex(
      (address: AddressDocument) => address._id?.toString() === addressId,
    );
    if (addressIndex === -1) {
      throw new NotFoundException(`Address with ID ${addressId} not found`);
    }
    console.log(user.shipping_addresses[addressIndex]);

    user.shipping_addresses[addressIndex] = Object.assign(
      user.shipping_addresses[addressIndex],
      updatedAddress,
    );

    console.log(user.shipping_addresses[addressIndex]);

    return user.save().then((user) => user.shipping_addresses);
  }
}
