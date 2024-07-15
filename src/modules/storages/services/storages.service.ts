import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsStorageService {
  private readonly s3: S3Client;
  private readonly bucketName = this.configService.get('AWS_BUCKET_NAME');
  private readonly bucketRegion = this.configService.get('AWS_BUCKET_REGION');
  private readonly accessKey = this.configService.get('AWS_ACCESS_KEY');
  private readonly secretKey = this.configService.get('AWS_SECRET_KEY');

  public constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.bucketRegion,
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.secretKey,
      },
    });
  }

  public async uploadMultipleFiles(
    files: Array<Express.Multer.File>,
  ): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file));
    const urls = await Promise.all(uploadPromises);
    return urls.map((url) => url.url);
  }

  public async uploadSingleFile(file: Express.Multer.File): Promise<string> {
    const { url } = await this.uploadFile(file);
    return url;
  }

  public async getUrlAndOriginalNames(
    files: Express.Multer.File[],
  ): Promise<{ url: string; originalName: string }[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file));
    return await Promise.all(uploadPromises);
  }

  private async uploadFile(
    file: Express.Multer.File,
  ): Promise<{ url: string; originalName: string }> {
    const params = {
      Bucket: this.bucketName,
      Region: this.bucketRegion,
      Key: this.randomFileName(file.originalname),
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    const command = new PutObjectCommand(params);
    await this.s3.send(command);
    const url = `https://${this.bucketName}.s3.${this.bucketRegion}.amazonaws.com/${params.Key}`;
    return {
      url,
      originalName: file.originalname,
    };
  }

  private randomFileName(originalName: string): string {
    return `${Date.now()}-${originalName}`;
  }
}
