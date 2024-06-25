import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Offering, OfferingSchema } from './schemas/offering.schema';
import { OfferingController } from './controllers/offering.controller';
import { OfferingService } from './services/offering.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forFeature([
      { name: Offering.name, schema: OfferingSchema },
    ]),
  ],
  controllers: [OfferingController],
  providers: [OfferingService],
  exports: [OfferingService],
})
export class OfferingModule { }
