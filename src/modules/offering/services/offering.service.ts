import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Offering, OfferingDocument } from '../schemas/offering.schema';
import { CreateOfferingDto } from '../dto/create-offering.dto';
import { UpdateOfferingDto } from '../dto/update-offering.dto';

@Injectable()
export class OfferingService {
  public constructor(
    @InjectModel(Offering.name) private offeringModel: Model<OfferingDocument>,
  ) {}

  public async create(createOfferingDto: CreateOfferingDto): Promise<Offering> {
    const createdOffering = new this.offeringModel(createOfferingDto);
    return createdOffering.save();
  }

  public async findAll(): Promise<Offering[]> {
    return this.offeringModel.find().exec();
  }

  public async findById(id: string): Promise<Offering> {
    const offering = await this.offeringModel.findById(id).exec();
    if (!offering) {
      throw new NotFoundException(`Offering with ID ${id} not found`);
    }
    return offering;
  }

  public async update(
    id: string,
    updateOfferingDto: UpdateOfferingDto,
  ): Promise<Offering> {
    const existingOffering = await this.offeringModel
      .findByIdAndUpdate(id, updateOfferingDto, { new: true })
      .exec();
    if (!existingOffering) {
      throw new NotFoundException(`Offering with ID ${id} not found`);
    }
    return existingOffering;
  }

  public async remove(id: string): Promise<void> {
    const result = await this.offeringModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Offering with ID ${id} not found`);
    }
  }
}
