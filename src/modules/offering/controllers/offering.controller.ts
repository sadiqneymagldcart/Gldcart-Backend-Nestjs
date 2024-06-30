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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateOfferingDto } from '@offering/dto/create-offering.dto';
import { UpdateOfferingDto } from '@offering/dto/update-offering.dto';
import { Offering } from '@offering/schemas/offering.schema';
import { OfferingService } from '@offering/services/offering.service';
import { SerializeWith } from '@shared/decorators/serialize.decorator';

@ApiTags('Proffesional Services')
@Controller('offerings')
@SerializeWith(Offering)
export class OfferingController {
  public constructor(private readonly offeringService: OfferingService) {}

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
