import * as cloudinary from "cloudinary";
import { configDotenv } from "dotenv";
import { CloudinaryUploadResult } from "../interfaces/CloudinaryUploadResult";

configDotenv();

cloudinary.v2.config({
    api_key: process.env.CLOUD_API_KEY,
    cloud_name: process.env.CLOUD_NAME,
    api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadToCloudinary: (
    file: Express.Multer.File,
) => Promise<CloudinaryUploadResult> = (file: Express.Multer.File) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            },
        );

        uploadStream.end(file.buffer);
    });
};
