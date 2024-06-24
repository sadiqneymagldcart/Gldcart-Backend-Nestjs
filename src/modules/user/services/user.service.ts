import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Nullable } from '@shared/types/common';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { User, UserDocument } from '@user/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  public constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) { }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  public async updateOrCreate(user: CreateUserDto): Promise<User> {
    return this.userModel.findOneAndUpdate({ email: user.email }, user, {
      upsert: true,
      new: true,
    });
  }

  public async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return existingUser;
  }

  public async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  public async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  public async findByEmail(email: string): Promise<Nullable<User>> {
    return this.userModel
      .findOne({
        email,
      })
      .exec();
  }

  public async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
