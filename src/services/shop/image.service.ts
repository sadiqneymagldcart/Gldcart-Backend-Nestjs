import { inject, injectable } from "inversify";
import { BaseService } from "../base/base.service";
import { Logger } from "@utils/logger";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

@injectable()
export class FileService extends BaseService {
  private readonly _bucketName = process.env.BUCKET_NAME as string;
  private readonly _bucketRegion = process.env.BUCKET_REGION as string;
  private readonly _accessKey = process.env.AWS_ACCESS as string;
  private readonly _secretKey = process.env.AWS_SECRET as string;

  private readonly s3 = new S3Client({
    region: this._bucketRegion,
    credentials: {
      accessKeyId: this._accessKey,
      secretAccessKey: this._secretKey,
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
          Bucket: this._bucketName,
          Key: this.randomFileName(file.originalname),
          Body: file.buffer,
          ContentType: file.mimetype,
        };
        const command = new PutObjectCommand(params);
        await this.s3.send(command);
        return `https://${this._bucketName}.s3.${this._bucketRegion}.amazonaws.com/${params.Key}`;
      }),
    );
  }

  private randomFileName(originalName: string): string {
    const random = Math.floor(Math.random() * 1000);
    const name = originalName.split(" ").join("-");
    return `${random}-${name}`;
  }
}
