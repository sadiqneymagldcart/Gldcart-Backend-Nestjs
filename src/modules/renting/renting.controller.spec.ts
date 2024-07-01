import { Test, TestingModule } from '@nestjs/testing';
import { RentingController } from './renting.controller';
import { RentingService } from './renting.service';

describe('RentingController', () => {
  let controller: RentingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentingController],
      providers: [RentingService],
    }).compile();

    controller = module.get<RentingController>(RentingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
