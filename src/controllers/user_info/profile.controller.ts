import * as express from "express";
import { controller, httpPost } from "inversify-express-utils";
import { ProfileService } from "../../services/user_info/profile.service";
import { inject } from "inversify";
import { multerMiddleware } from "../../middlewares/malter.middleware";
import { requireAuth } from "../../middlewares/auth.middleware";
import { ImageService } from "../../services/shop/image.service";

@controller("/profile")
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

    @httpPost(
        "/update-profile-picture",
        requireAuth,
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

            const { user_id } = request.body;

            console.log(images);
            await this.profileService.updateProfilePicture(user_id, images[0]);
            response
                .status(200)
                .json({ message: `User's profile picture was updated succesfully` });
        } catch (error) {
            next(error);
        }
    }
}
