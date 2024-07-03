import { Storage } from "../interfaces/Storage";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export class AW3Storage implements Storage {
    private readonly s3: S3Client;
    private readonly bucketName: string;
    private readonly bucketRegion: string;
    private readonly accessKey: string;
    private readonly secretKey: string;

    public constructor() {
        this.bucketName = process.env.AWS_BUCKET_NAME;
        this.bucketRegion = process.env.AWS_REGION;
        this.accessKey = process.env.AWS_ACCESS_KEY;
        this.secretKey = process.env.AWS_SECRET_KEY;
        this.s3 = new S3Client({
            region: this.bucketRegion,
            credentials: {
                accessKeyId: this.accessKey,
                secretAccessKey: this.secretKey,
            },
        });
    }
    upload(files: Express.Multer.File[]): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const urls: string[] = [];
            files.forEach(async (file) => {
                const params = {
                    Bucket: this.bucketName,
                    Key: this.randomFileName(file.originalname),
                    Body: file.buffer,
                    ContentType: file.mimetype,
                };
                const command = new PutObjectCommand(params);
                try {
                    await this.s3.send(command);
                    urls.push(
                        `https://${this.bucketName}.s3.${this.bucketRegion}.amazonaws.com/${params.Key}`,
                    );
                    if (urls.length === files.length) {
                        resolve(urls);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });
    }
    private randomFileName(originalName: string): string {
        return `${Date.now()}-${originalName}`;
    }
}
