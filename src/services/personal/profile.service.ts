import { inject, injectable } from "inversify";
import { Logger } from "@utils/logger";
import {UserModel} from "@models/user/User";
import { BaseService } from "../base/base.service";
import {BadRequestException} from "@exceptions/bad-request.exception";

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
            throw new BadRequestException("User not found");
        }
        user.profile_picture = imageUrl;
        await user.save();
    }

    public async updatePersonalDetails(
        id: string | null,
        email: string | null,
        name: string | null,
        surname: string | null,
        phone_number: string | null,
        address: string | null,
        BIO: string | null,
    ) {
        const user = await UserModel.findByIdAndUpdate(id, {
            name: name,
            surname: surname,
            email: email,
            phone_number: phone_number,
            address: address,
            BIO: BIO,
        });
        if (!user) {
            this.logger.logError(
                `User not found while updating details for ID: ${id}`,
            );
            throw new BadRequestException("User not found");
        }
        await user.save();
        this.logger.logInfo(`Personal details updated for user with ID: ${id}`);
    }
}
