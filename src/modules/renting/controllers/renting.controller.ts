import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Logger,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRentingDto } from '@renting/dto/create-renting.dto';
import { UpdateRentingDto } from '@renting/dto/update-renting.dto';
import { RentingService } from '@renting/services/renting.service';
import { AwsStorageService } from '@storages/services/aws-storage.service';

@ApiTags('Rentings')
@Controller('renting')
@UseInterceptors(CacheInterceptor)
export class RentingController {
  private readonly logger = new Logger(RentingController.name);

  public constructor(
    private readonly rentingService: RentingService,
    private readonly awsStorage: AwsStorageService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  @ApiOperation({ summary: 'Create a rent' })
  @ApiConsumes('multipart/form-data')
  public async create(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() rent: CreateRentingDto,
  ) {
    const imageUrls = await this.awsStorage.uploadMultipleFiles(images);
    const rentWithImages = { ...rent, images: imageUrls };
    return this.rentingService.create(rentWithImages);
  }

  @Get()
  getAllRentings() {
    return this.rentingService.getAll();
  }

  @Get(':id')
  getRenting(@Param('id') id: string) {
    return this.rentingService.getById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRentingDto: UpdateRentingDto) {
    return this.rentingService.update(+id, updateRentingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rentingService.remove(+id);
  }
}
