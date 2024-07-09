import { Module } from '@nestjs/common';
import { AwsStorageService } from './services/storages.service';

@Module({
  providers: [AwsStorageService],
  exports: [AwsStorageService],
})
export class StoragesModule { }
