import { UserModel } from "@models/user/User";
import { BaseService } from "@services/base/base.service";
import { IUser } from "@ts/interfaces/IUser";
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

        public async getAllUsers(): Promise<IUser[]> {
                return UserModel.find();
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

        public async updateUser(
                userId: string,
                updatedData: Partial<IUser>,
        ): Promise<IUser | null> {
                return UserModel.findByIdAndUpdate(userId, updatedData, {
                        new: true,
                });
        }

        public async deleteUser(userId: string): Promise<IUser | null> {
                return UserModel.findByIdAndDelete(userId);
        }
}
export { UserService };
