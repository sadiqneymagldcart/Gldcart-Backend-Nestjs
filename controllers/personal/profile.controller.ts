import * as express from "express";
import {
    BaseHttpController,
    controller,
    httpPut,
} from "inversify-express-utils";
import { ProfileService } from "@services/personal/profile.service";
import { inject } from "inversify";
import { multerMiddleware } from "@middlewares/malter.middleware";
import { FileService } from "@services/shop/image.service";
import { AuthenticationMiddleware } from "@middlewares/authentication.middleware";

@controller("/personal", AuthenticationMiddleware)
class ProfileController extends BaseHttpController {
    private readonly profileService: ProfileService;
    private readonly imageService: FileService;

    public constructor(
        @inject(ProfileService) profileService: ProfileService,
        @inject(FileService) imageService: FileService,
    ) {
        super();
        this.profileService = profileService;
        this.imageService = imageService;
    }

    @httpPut("/", multerMiddleware.any())
    public async updateProfilePicture(request: express.Request): Promise<void> {
        const files = request.files as Express.Multer.File[];
        const images = await this.imageService.uploadImagesWithAws(files);
        const { userId } = request.body;
        await this.profileService.updateProfilePicture(userId, images[0]);
        this.ok({ message: `User's profile picture was updated successfully` });
    }

    @httpPut("/details")
    public async updatePersonalDetails(request: express.Request): Promise<void> {
        const { id, email, name, surname, phone_number, address, BIO } =
            request.body;
        await this.profileService.updatePersonalDetails(
            id,
            email,
            name,
            surname,
            phone_number,
            address,
            BIO,
        );
        this.ok({ message: `User's personal details were updated successfully` });
    }
}

export { ProfileController };
