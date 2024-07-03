import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Nullable } from '@shared/types/common';
import StripeService from '@stripe/services/stripe.service';
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
    const user = new this.userModel({
      ...userData,
      stripeCustomerId: stripeCustomer.id,
    });
    return user.save();
  }

  public async updateOrCreate(userData: CreateUserDto): Promise<User> {
    return this.userModel.findOneAndUpdate(
      { email: userData.email },
      userData,
      {
        upsert: true,
        new: true,
      },
    );
  }

  public async update(id: string, userData: UpdateUserDto): Promise<User> {
    const existingUser = await this.userModel
      .findByIdAndUpdate(id, userData, { new: true })
      .exec();
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return existingUser;
  }

  public async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  public async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  public async findByEmail(email: string): Promise<Nullable<User>> {
    return this.userModel.findOne({
      email,
    });
  }

  public async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
