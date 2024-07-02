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
  HttpCode,
  HttpStatus,
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
import { SerializeWith } from '@shared/decorators/serialize.decorator';

@ApiTags('Proffesional Services')
@Controller('offerings')
@SerializeWith(Offering)
export class OfferingController {
  public constructor(private readonly offeringService: OfferingService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an offering' })
  @ApiBody({ type: CreateOfferingDto })
  @ApiResponse({
    status: 201,
    description: 'The offering has been successfully created.',
  })
  public async create(
    @Body() createOfferingDto: CreateOfferingDto,
  ): Promise<Offering> {
    return await this.offeringService.create(createOfferingDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all offerings' })
  @ApiResponse({ status: 200, description: 'Return all offerings.' })
  @UseInterceptors(CacheInterceptor)
  public async findAll(): Promise<Offering[]> {
    return await this.offeringService.findAll();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get offerings with filters' })
  @ApiQuery({
    name: 'size',
    required: true,
    type: Number,
    description: 'Size of items per page',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    type: Number,
    description: 'Page number',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of offerings',
    type: PaginatedResourceDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UseInterceptors(CacheInterceptor)
  public async getByFilters(
    @PaginationParams() paginationParams: Pagination,
    @FilteringParams() filters: { [key: string]: any },
  ) {
    return await this.offeringService.getByFilters(paginationParams, filters);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get offerings by search text' })
  @ApiQuery({
    name: 'text',
    required: true,
    type: String,
    description: 'Text to search for',
  })
  @ApiQuery({
    name: 'size',
    required: true,
    type: Number,
    description: 'Size of items per page',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    type: Number,
    description: 'Page number',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of offerings',
    type: PaginatedResourceDto<Offering>,
  })
  public async getBySearchQuery(
    @PaginationParams() paginationParams: Pagination,
    @Query('text') text: string,
  ) {
    return this.offeringService.getBySearchQuery(paginationParams, text);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get an offering by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the offering with the given ID.',
  })
  @ApiResponse({ status: 404, description: 'Offering not found.' })
  @UseInterceptors(CacheInterceptor)
  public async findById(@Param('id') id: string): Promise<Offering> {
    return await this.offeringService.findById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an offering by ID' })
  @ApiResponse({
    status: 200,
    description: 'The offering has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Offering not found.' })
  public async update(
    @Param('id') id: string,
    @Body() updateOfferingDto: UpdateOfferingDto,
  ): Promise<Offering> {
    return await this.offeringService.update(id, updateOfferingDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an offering by ID' })
  @ApiResponse({
    status: 204,
    description: 'The offering has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Offering not found.' })
  public async remove(@Param('id') id: string): Promise<void> {
    return await this.offeringService.remove(id);
  }
}
