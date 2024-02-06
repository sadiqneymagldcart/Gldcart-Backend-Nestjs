import { inject, injectable } from "inversify";
import { BaseService } from "../base.service";
import { Logger } from "../../utils/logger";
import UserModel from "../../models/user/User";
import { ApiError } from "../../exceptions/api.error";

@injectable()
export class ProfileService extends BaseService {
    public constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }

    public async updateProfilePicture(userId: string, imageUrl: string) {
        const user = await UserModel.findById(userId);
        if (!user) {
            this.logger.logError(
                `User ${userId} not found while updating profile picture`,
            );
            throw ApiError.BadRequest("User not found");
        }
        user.picture = imageUrl;
        await user.save();
    }
}
