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
  private readonly searchService: SearchService<OfferingDocument>;
  public constructor(
    @InjectModel(Offering.name) private offeringModel: Model<OfferingDocument>,
  ) {
    this.searchService = new SearchService<OfferingDocument>(offeringModel);
  }

  public async createOffering(
    createOfferingDto: CreateOfferingDto,
  ): Promise<Offering> {
    const newOffering = new this.offeringModel(createOfferingDto);
    return await newOffering.save();
  }

  public async getAllOfferings(): Promise<Offering[]> {
    return this.offeringModel.find();
  }

  public async getOfferingById(id: string): Promise<Offering> {
    const offering = await this.offeringModel.findById(id);
    if (!offering) {
      throw new NotFoundException(`Offering with ID ${id} not found`);
    }
    return offering;
  }

  public async getOfferingsByFilters(
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

  public async getOfferingsBySearchQuery(
    pagination: Pagination,
    searchQuery: string,
  ): Promise<Offering[]> {
    return await this.searchService.searchWithPaginationAndText(
      pagination,
      searchQuery,
    );
  }

  public async updateOffering(
    id: string,
    updateOfferingDto: UpdateOfferingDto,
  ): Promise<Offering> {
    const updatedOffering = await this.offeringModel.findByIdAndUpdate(
      id,
      updateOfferingDto,
      { new: true },
    );
    if (!updatedOffering) {
      throw new NotFoundException(`Offering with ID ${id} not found`);
    }
    return updatedOffering;
  }

  public async removeOffering(id: string): Promise<void> {
    const deletedOffering = await this.offeringModel.findByIdAndDelete(id);
    if (!deletedOffering) {
      throw new NotFoundException(`Offering with ID ${id} not found`);
    }
  }
}
