import { IUser, UserModel } from "@models/user/User";
import { BaseService } from "@services/base/base.service";
import { Nullable } from "@ts/types/nullable";
import { Logger } from "@utils/logger";
import { inject, injectable } from "inversify";

@injectable()
class UserService extends BaseService {
        public constructor(@inject(Logger) logger: Logger) {
                super(logger);
        }

        public async addUser(user: Partial<IUser>): Promise<IUser> {
                return await UserModel.create(user);
        }

        public async getUserById(userId: string): Promise<Nullable<IUser>> {
                return UserModel.findById(userId);
        }

        public async getUserByToken(token: string): Promise<Nullable<IUser>> {
                return UserModel.findOne({ passwordResetToken: token });
        }

        public async getUserByEmail(email: string): Promise<IUser | null> {
                return UserModel.findOne({ email: email });
        }

        public async getUserByEmailAndUpdate(
                email: string,
                updatedData: Partial<IUser>,
        ): Promise<IUser | null> {
                return UserModel.findOneAndUpdate({ email }, updatedData);
        }

        public async getUserByIdAndPopulate(
                userId: string,
                data: string,
        ): Promise<IUser | null> {
                return UserModel.findById(userId).populate(data);
        }

        public async getUserByIdAndUpdate(
                userId: string,
                updatedData: Partial<IUser>,
        ): Promise<IUser | null> {
                return UserModel.findByIdAndUpdate(userId, updatedData);
        }

        public async getUserByData(data: Partial<IUser>): Promise<IUser | null> {
                return UserModel.findOne({ data });
        }

        public async updateUser(
                userId: string,
                updatedData: Partial<IUser>,
        ): Promise<IUser | null> {
                return UserModel.findByIdAndUpdate(userId, updatedData, {
                        new: true,
                });
        }
}
export { UserService };
