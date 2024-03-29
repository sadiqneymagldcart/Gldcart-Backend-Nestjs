import { injectable } from "inversify";
import { Storage } from "../interfaces/Storage";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

@injectable()
export class AwsStorage implements Storage {
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

    public async uploadArrayBuffer(
        arrayBuffer: ArrayBuffer,
        originalName: string,
        mimetype: string,
    ): Promise<string> {
        const buffer = Buffer.from(arrayBuffer);
        return this.uploadBuffer(buffer, originalName, mimetype);
    }

    public async uploadBuffer(
        buffer: Buffer,
        originalName: string,
        mimetype: string,
    ): Promise<string> {
        const params = {
            Bucket: this.bucketName,
            Region: this.bucketRegion,
            Key: this.randomFileName(originalName),
            Body: buffer,
            ContentType: mimetype,
        };
        const command = new PutObjectCommand(params);
        await this.s3.send(command);
        return `https://${this.bucketName}.s3.${this.bucketRegion}.amazonaws.com/${params.Key}`;
    }

    public async uploadBase64(
        base64: string,
        originalName: string,
    ): Promise<string> {
        const buffer = Buffer.from(base64, "base64");
        return this.uploadBuffer(buffer, originalName, "image/jpeg");
    }

    private randomFileName(originalName: string): string {
        return `${Date.now()}-${originalName}`;
    }
}
