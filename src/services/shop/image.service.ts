import { inject, injectable } from "inversify";
import { BaseService } from "../base/base.service";
import { Logger } from "../../utils/logger";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

@injectable()
export class FileService extends BaseService {
  private readonly bucketName = process.env.BUCKET_NAME;
  private readonly bucketRegion = process.env.BUCKET_REGION;
  private readonly accessKey = process.env.AWS_ACCESS;
  private readonly secretKey = process.env.AWS_SECRET;

  private readonly s3 = new S3Client({
    region: this.bucketRegion,
    credentials: {
      accessKeyId: this.accessKey,
      secretAccessKey: this.secretKey,
    },
  });
  public constructor(@inject(Logger) logger: Logger) {
    super(logger);
  }

  public async uploadImagesWithAws(
    files: Express.Multer.File[],
  ): Promise<string[]> {
    return await Promise.all(
      files.map(async (file) => {
        const params = {
          Bucket: this.bucketName,
          Key: this.randomFileName(file.originalname),
          Body: file.buffer,
          ContentType: file.mimetype,
        };
        const command = new PutObjectCommand(params);
        await this.s3.send(command);
        return `https://${this.bucketName}.s3.${this.bucketRegion}.amazonaws.com/${params.Key}`;
      }),
    );
  }

  private randomFileName(originalName: string): string {
    const random = Math.floor(Math.random() * 1000);
    const name = originalName.split(" ").join("-");
    return `${random}-${name}`;
  }
}
