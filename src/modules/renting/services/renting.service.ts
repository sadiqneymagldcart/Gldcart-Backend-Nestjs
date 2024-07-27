import { Injectable } from '@nestjs/common';
import { CreateRentingDto } from '@renting/dto/create-renting.dto';
import { UpdateRentingDto } from '@renting/dto/update-renting.dto';

@Injectable()
export class RentingService {
  public create(createRentingDto: CreateRentingDto) {
    return 'This action adds a new renting';
  }

  public getAll() {
    return `This action returns all renting`;
  }

  public getById(id: string) {
    return `This action returns a #${id} renting`;
  }

  public update(id: number, updateRentingDto: UpdateRentingDto) {
    return `This action updates a #${id} renting`;
  }

  public remove(id: number) {
    return `This action removes a #${id} renting`;
  }
}
