import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Offering, OfferingSchema } from './schemas/offering.schema';
import { OfferingController } from './controllers/offering.controller';
import { OfferingService } from './services/offering.service';
import { SearchService } from '@search/services/search.service';
import { AwsStorageService } from '@storages/services/storages.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Offering.name, schema: OfferingSchema },
    ]),
  ],
  controllers: [OfferingController],
  providers: [OfferingService, SearchService, AwsStorageService],
  exports: [OfferingService],
})
export class OfferingModule {}
