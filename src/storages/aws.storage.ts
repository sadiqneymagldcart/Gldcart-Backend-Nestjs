import { injectable } from "inversify";
import { IStorage } from "@interfaces/IStorage";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

@injectable()
export class AwsStorage implements IStorage {
    private readonly _s3: S3Client;
    private readonly _bucketName: string = process.env.AWS_BUCKET_NAME!;
    private readonly _bucketRegion: string = process.env.AWS_REGION!;
    private readonly _accessKey: string = process.env.AWS_ACCESS_KEY!;
    private readonly _secretKey: string = process.env.AWS_SECRET_KEY!;

    public constructor() {
        this._s3 = new S3Client({
            region: this._bucketRegion,
            credentials: {
                accessKeyId: this._accessKey,
                secretAccessKey: this._secretKey,
            },
        });
    }
    upload(files: Express.Multer.File[]): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const urls: string[] = [];
            files.forEach(async (file) => {
                const params = {
                    Bucket: this._bucketName,
                    Region: this._bucketRegion,
                    Key: this.randomFileName(file.originalname),
                    Body: file.buffer,
                    ContentType: file.mimetype,
                };
                const command = new PutObjectCommand(params);
                try {
                    await this._s3.send(command);
                    urls.push(
                        `https://${this._bucketName}.s3.${this._bucketRegion}.amazonaws.com/${params.Key}`,
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
                    Bucket: this._bucketName,
                    Region: this._bucketRegion,
                    Key: this.randomFileName(file.originalname),
                    Body: file.buffer,
                    ContentType: file.mimetype,
                };
                const command = new PutObjectCommand(params);
                try {
                    await this._s3.send(command);
                    urls.push({
                        url: `https://${this._bucketName}.s3.${this._bucketRegion}.amazonaws.com/${params.Key}`,
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
