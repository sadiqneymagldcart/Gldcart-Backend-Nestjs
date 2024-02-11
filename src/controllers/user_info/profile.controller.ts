import * as express from "express";
import { controller, httpPost, httpPut } from "inversify-express-utils";
import { ProfileService } from "../../services/user_info/profile.service";
import { inject } from "inversify";
import { multerMiddleware } from "../../middlewares/malter.middleware";
import { requireAuth } from "../../middlewares/auth.middleware";
import { ImageService } from "../../services/shop/image.service";

@controller("/personal")
export class ProfileController {
    private readonly profileService: ProfileService;
    private readonly imageService: ImageService;
    constructor(
        @inject(ProfileService) profileService: ProfileService,
        @inject(ImageService) imageService: ImageService,
    ) {
        this.profileService = profileService;
        this.imageService = imageService;
    }

    @httpPut(
        "/",
        multerMiddleware.single("profilePicture"),
    )
    public async updateProfilePicture(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const files = request.files as Express.Multer.File[];
            const images = await this.imageService.uploadImages(files);

            const { userId } = request.body;

            console.log(images);
            await this.profileService.updateProfilePicture(userId, images[0]);
            response
                .status(200)
                .json({ message: `User's profile picture was updated succesfully` });
        } catch (error) {
            next(error);
        }
    }

}
