import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Nullable } from '@shared/types/common';
import { CreateUserDto } from '@user/dto/create.user.dto';
import { User } from '@user/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  private readonly userModel: Model<User>;
  private readonly logger: Logger = new Logger(UserService.name);

  public constructor(@InjectModel(User.name) userModel: Model<User>) {
    this.userModel = userModel;
  }

  public async createAndSaveUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    const savedUser = await user.save();
    this.logger.log(`User created: ${JSON.stringify(savedUser)}`);
    return savedUser;
  }

  public async getAll(): Promise<User[]> {
    return this.userModel.find();
  }

  public async findUserById(id: string): Promise<Nullable<User>> {
    return this.userModel.findById(id);
  }

  public async findUserByEmail(email: string): Promise<Nullable<User>> {
    return this.userModel
      .findOne({
        email,
      })
      .exec();
  }
}
