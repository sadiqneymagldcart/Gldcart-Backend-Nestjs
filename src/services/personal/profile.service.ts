import { inject, injectable } from "inversify";
import { Logger } from "@utils/logger";
import { BaseService } from "../base/base.service";
import { BadRequestException } from "@exceptions/bad-request.exception";
import { UserService } from "@services/user/user.service";

@injectable()
export class ProfileService extends BaseService {
    private readonly userService: UserService;

    public constructor(
        @inject(Logger) logger: Logger,
        @inject(UserService) userService: UserService,
    ) {
        super(logger);
        this.userService = userService;
    }

    public async updateProfilePicture(userId: string, imageUrl: string) {
        const user = await this.userService.getUserById(userId);
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
        id: string,
        email: string | undefined,
        name: string | undefined,
        surname: string | undefined,
        phone_number: string | undefined,
        address: string | undefined,
        BIO: string | undefined,
    ) {
        const user = await this.userService.getUserByIdAndUpdate(id, {
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
