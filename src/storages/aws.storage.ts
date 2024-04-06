import { injectable } from "inversify";
import { Storage } from "@interfaces/Storage";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

@injectable()
export class AwsStorage implements Storage {
    private readonly s3: S3Client;
    private readonly bucketName: string = process.env.AWS_BUCKET_NAME!;
    private readonly bucketRegion: string = process.env.AWS_REGION!;
    private readonly accessKey: string = process.env.AWS_ACCESS_KEY!;
    private readonly secretKey: string = process.env.AWS_SECRET_KEY!;

    public constructor() {
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
                    Region: this.bucketRegion,
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

    public async getUrlAndOriginalNames(
        files: Express.Multer.File[],
    ): Promise<{ url: string; originalName: string }[]> {
        return new Promise((resolve, reject) => {
            const urls: { url: string; originalName: string }[] = [];
            files.forEach(async (file) => {
                const params = {
                    Bucket: this.bucketName,
                    Region: this.bucketRegion,
                    Key: this.randomFileName(file.originalname),
                    Body: file.buffer,
                    ContentType: file.mimetype,
                };
                const command = new PutObjectCommand(params);
                try {
                    await this.s3.send(command);
                    urls.push({
                        url: `https://${this.bucketName}.s3.${this.bucketRegion}.amazonaws.com/${params.Key}`,
                        originalName: file.originalname,
                    });
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
