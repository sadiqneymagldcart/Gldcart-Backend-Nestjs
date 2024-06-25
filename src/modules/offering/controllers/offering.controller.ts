import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OfferingService } from '../services/offering.service';
import { Offering } from '../schemas/offering.schema';
import { SerializeWith } from '@shared/decorators/serialize.decorator';
import { CreateOfferingDto } from '../dto/create-offering.dto';
import { UpdateOfferingDto } from '../dto/update-offering.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('Proffesional Services')
@Controller('offerings')
@SerializeWith(Offering)
export class OfferingController {
  public constructor(private readonly offeringService: OfferingService) { }

  @ApiOperation({ summary: 'Create an offering' })
  @ApiResponse({
    status: 201,
    description: 'The offering has been successfully created.',
  })
  @Post()
  public async create(
    @Body() createOfferingDto: CreateOfferingDto,
  ): Promise<Offering> {
    return this.offeringService.create(createOfferingDto);
  }

  @ApiOperation({ summary: 'Get all offerings' })
  @ApiResponse({ status: 200, description: 'Return all offerings.' })
  @Get()
  @UseInterceptors(CacheInterceptor)
  public async findAll(): Promise<Offering[]> {
    return this.offeringService.findAll();
  }

  @ApiOperation({ summary: 'Get an offering by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the offering with the given ID.',
  })
  @ApiResponse({ status: 404, description: 'Offering not found.' })
  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  public async findById(@Param('id') id: string): Promise<Offering> {
    return this.offeringService.findById(id);
  }

  @ApiOperation({ summary: 'Update an offering by ID' })
  @ApiResponse({
    status: 200,
    description: 'The offering has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Offering not found.' })
  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateOfferingDto: UpdateOfferingDto,
  ): Promise<Offering> {
    return this.offeringService.update(id, updateOfferingDto);
  }

  @ApiOperation({ summary: 'Delete an offering by ID' })
  @ApiResponse({
    status: 204,
    description: 'The offering has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Offering not found.' })
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<void> {
    return this.offeringService.remove(id);
  }
}
