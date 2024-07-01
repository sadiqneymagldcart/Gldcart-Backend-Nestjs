import { Test, TestingModule } from '@nestjs/testing';
import { RentingService } from './renting.service';

describe('RentingService', () => {
  let service: RentingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RentingService],
    }).compile();

    service = module.get<RentingService>(RentingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
