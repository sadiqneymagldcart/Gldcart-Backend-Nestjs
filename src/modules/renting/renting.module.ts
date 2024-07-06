import { Module } from '@nestjs/common';
import { RentingService } from './services/renting.service';
import { RentingController } from './controllers/renting.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Renting, RentingSchema } from './schemas/renting.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Renting.name, schema: RentingSchema }]),
  ],
  controllers: [RentingController],
  providers: [RentingService],
  exports: [RentingService],
})
export class RentingModule {}
