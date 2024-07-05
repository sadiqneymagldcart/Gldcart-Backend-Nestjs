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
  public constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly stripeService: StripeService,
  ) { }

  public async create(userData: CreateUserDto): Promise<User> {
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

  public async update(id: string, userData: UpdateUserDto): Promise<User> {
    const existingUser = await this.userModel.findByIdAndUpdate(id, userData, {
      new: true,
    });
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return existingUser;
  }

  public async findAll(): Promise<User[]> {
    return this.userModel.find().lean();
  }

  public async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).lean();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  public async findByEmail(email: string): Promise<Nullable<User>> {
    return this.userModel.findOne({ email }).lean();
  }

  public async remove(id: string): Promise<void> {
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
}
