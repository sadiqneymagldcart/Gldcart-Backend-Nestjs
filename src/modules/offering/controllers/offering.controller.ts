import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateOfferingDto } from '@offering/dto/create-offering.dto';
import { PaginatedResourceDto } from '@search/dto/paginated-resource.dto';
import { UpdateOfferingDto } from '@offering/dto/update-offering.dto';
import { Offering } from '@offering/schemas/offering.schema';
import { OfferingService } from '@offering/services/offering.service';
import { FilteringParams } from '@shared/decorators/filtering.decorator';
import {
  Pagination,
  PaginationParams,
} from '@shared/decorators/pagination.decorator';

@ApiTags('Proffesional Services')
@Controller('offerings')
@UseInterceptors(CacheInterceptor)
export class OfferingController {
  public constructor(private readonly offeringService: OfferingService) { }

  @Post()
  @ApiOperation({ summary: 'Create an offering' })
  @ApiBody({ type: CreateOfferingDto })
  @ApiResponse({
    status: 201,
    description: 'The offering has been successfully created.',
  })
  public async createNewOffering(
    @Body() offeringDto: CreateOfferingDto,
  ): Promise<Offering> {
    return this.offeringService.createOffering(offeringDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get offerings' })
  @ApiQuery({
    name: 'size',
    required: false,
    type: Number,
    description: 'Size of items per page',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'text',
    required: false,
    type: String,
    description: 'Text to search for',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of offerings',
    type: PaginatedResourceDto<Offering>,
  })
  public async getAllOfferings(
    @PaginationParams() paginationParams: Pagination,
    @FilteringParams() filters: { [key: string]: any },
    @Query('text') text: string,
  ) {
    if (text) {
      return this.offeringService.getOfferingsBySearchQuery(
        paginationParams,
        text,
      );
    } else {
      return this.offeringService.getOfferingsByFilters(
        paginationParams,
        filters,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an offering by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the offering with the given ID.',
  })
  @ApiResponse({ status: 404, description: 'Offering not found.' })
  public async getOfferingById(@Param('id') id: string): Promise<Offering> {
    return await this.offeringService.findOfferingById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an offering by ID' })
  @ApiResponse({
    status: 200,
    description: 'The offering has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Offering not found.' })
  public async updateOffering(
    @Param('id') id: string,
    @Body() updateOfferingDto: UpdateOfferingDto,
  ): Promise<Offering> {
    return this.offeringService.updateOffering(id, updateOfferingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an offering by ID' })
  @ApiResponse({
    status: 204,
    description: 'The offering has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Offering not found.' })
  public async deleteOffering(@Param('id') id: string): Promise<void> {
    return this.offeringService.deleteOffering(id);
  }
}
