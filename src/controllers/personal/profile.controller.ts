import * as express from "express";
import { Controller, controller, httpPut } from "inversify-express-utils";
import { ProfileService } from "@services/personal/profile.service";
import { inject } from "inversify";
import { multerMiddleware } from "@middlewares/malter.middleware";
import { FileService } from "@services/shop/image.service";

@controller("/personal")
export class ProfileController implements Controller {
    private readonly profileService: ProfileService;
    private readonly imageService: FileService;
    public constructor(
        @inject(ProfileService) profileService: ProfileService,
        @inject(FileService) imageService: FileService,
    ) {
        this.profileService = profileService;
        this.imageService = imageService;
    }

    @httpPut("/", multerMiddleware.any())
    public async updateProfilePicture(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const files = request.files as Express.Multer.File[];
            const images = await this.imageService.uploadImagesWithAws(files);

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

    @httpPut("/details")
    public async updatePersonalDetails(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
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
            response
                .status(200)
                .json({ message: `User's personal details were updated succesfully` });
        } catch (error) {
            next(error);
        }
    }
}
