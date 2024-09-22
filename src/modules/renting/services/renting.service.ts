import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRentingDto } from '@renting/dto/create-renting.dto';
import { UpdateRentingDto } from '@renting/dto/update-renting.dto';
import { Renting, RentingDocument } from '@renting/schemas/renting.schema';
import { Model } from 'mongoose';

@Injectable()
export class RentingService {
  public constructor(
    @InjectModel(Renting.name)
    private readonly rentingModel: Model<RentingDocument>,
  ) {}

  public async create(createRentingDto: CreateRentingDto): Promise<Renting> {
    const createdRent = new this.rentingModel(createRentingDto);
    return createdRent.save();
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
