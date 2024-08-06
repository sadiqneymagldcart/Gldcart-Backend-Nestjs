import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateRentingDto } from '@renting/dto/create-renting.dto';
import { UpdateRentingDto } from '@renting/dto/update-renting.dto';
import { RentingService } from '@renting/services/renting.service';

@ApiTags('Rentings')
@Controller('renting')
export class RentingController {
  public constructor(private readonly rentingService: RentingService) {}

  @Post()
  create(@Body() createRentingDto: CreateRentingDto) {
    return this.rentingService.create(createRentingDto);
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
