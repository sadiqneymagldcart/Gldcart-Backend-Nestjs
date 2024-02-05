import * as cloudinary from 'cloudinary'
import {configDotenv} from "dotenv";

configDotenv();

cloudinary.v2.config({
    api_key: process.env.CLOUD_API_KEY,
    cloud_name: process.env.CLOUD_NAME,
    api_secret: process.env.CLOUD_API_SECRET,
});

interface CloudinaryUploadResult {
    public_id: string;
    version: number;
    signature: string;
    width: number;
    height: number;
    format: string;
    created_at: string;
    bytes: number;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    original_filename: string;
}

export const uploadToCloudinary: (file: Express.Multer.File) => Promise<CloudinaryUploadResult> = (file: Express.Multer.File) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream({resource_type: 'auto'}, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });

        uploadStream.end(file.buffer);
    });
};