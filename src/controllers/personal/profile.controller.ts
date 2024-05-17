import * as express from "express";
import { controller, httpPut } from "inversify-express-utils";
import { ProfileService } from "@services/personal/profile.service";
import { inject } from "inversify";
import { multerMiddleware } from "@middlewares/malter.middleware";
import { FileService } from "@services/shop/image.service";

@controller("/personal")
export class ProfileController {
    private readonly _profileService: ProfileService;
    private readonly _imageService: FileService;
    public constructor(
        @inject(ProfileService) profileService: ProfileService,
        @inject(FileService) imageService: FileService,
    ) {
        this._profileService = profileService;
        this._imageService = imageService;
    }

    @httpPut("/", multerMiddleware.any())
    public async updateProfilePicture(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const files = request.files as Express.Multer.File[];
            const images = await this._imageService.uploadImagesWithAws(files);

            const { userId } = request.body;

            console.log(images);
            await this._profileService.updateProfilePicture(userId, images[0]);
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
            await this._profileService.updatePersonalDetails(
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
