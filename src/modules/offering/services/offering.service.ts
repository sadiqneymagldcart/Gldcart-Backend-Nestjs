import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Offering, OfferingDocument } from '../schemas/offering.schema';
import { CreateOfferingDto } from '../dto/create-offering.dto';
import { UpdateOfferingDto } from '../dto/update-offering.dto';
import { SearchService } from '@search/services/search.service';
import { Pagination } from '@shared/decorators/pagination.decorator';

@Injectable()
export class OfferingService {
  public constructor(
    @InjectModel(Offering.name) private offeringModel: Model<OfferingDocument>,
    private readonly searchService: SearchService<OfferingDocument>,
  ) { }

  public async create(createOfferingDto: CreateOfferingDto): Promise<Offering> {
    const createdOffering = new this.offeringModel(createOfferingDto);
    return await createdOffering.save();
  }

  public async findAll(): Promise<Offering[]> {
    return await this.offeringModel.find();
  }

  public async findById(id: string): Promise<Offering> {
    const offering = await this.offeringModel.findById(id);
    if (!offering) {
      throw new NotFoundException(`Offering with ID ${id} not found`);
    }
    return offering;
  }

  public async getByFilters(
    pagination: Pagination,
    filters: {
      [key: string]: any;
    } = {},
  ): Promise<Offering[]> {
    return await this.searchService.searchWithPaginationAndFilters(
      pagination,
      filters,
    );
  }

  public async getBySearchQuery(
    pagination: Pagination,
    searchQuery: string,
  ): Promise<Offering[]> {
    return await this.searchService.searchWithPaginationAndText(
      pagination,
      ['name', 'description', 'category'],
      searchQuery,
    );
  }

  public async update(
    id: string,
    updateOfferingDto: UpdateOfferingDto,
  ): Promise<Offering> {
    const existingOffering = await this.offeringModel.findByIdAndUpdate(
      id,
      updateOfferingDto,
      { new: true },
    );
    if (!existingOffering) {
      throw new NotFoundException(`Offering with ID ${id} not found`);
    }
    return existingOffering;
  }

  public async remove(id: string): Promise<void> {
    const result = await this.offeringModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Offering with ID ${id} not found`);
    }
  }
}
