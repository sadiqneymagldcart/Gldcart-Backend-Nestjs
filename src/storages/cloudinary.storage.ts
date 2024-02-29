import { v2 as cloudinary } from "cloudinary";
import { injectable } from "inversify";
import { Storage } from "../interfaces/Storage";
import { CloudinaryUploadResult } from "../interfaces/CloudinaryUploadResult";

@injectable()
export class CloudinaryStorage implements Storage {
    public constructor() {
        cloudinary.config({
            api_key: process.env.CLOUD_API_KEY,
            cloud_name: process.env.CLOUD_NAME,
            api_secret: process.env.CLOUD_API_SECRET,
        });
    }

    upload(files: Express.Multer.File[]): Promise<string[]> {
        return Promise.all(
            files.map((file) => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { resource_type: "auto" },
                        (error, result: CloudinaryUploadResult) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result.secure_url);
                            }
                        },
                    );

                    uploadStream.end(file.buffer);
                });
            }),
        ) as Promise<string[]>;
    }


}
