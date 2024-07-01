import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RentingService } from '../services/renting.service';
import { CreateRentingDto } from '../dto/create-renting.dto';
import { UpdateRentingDto } from '../dto/update-renting.dto';
import { SerializeWith } from '@shared/decorators/serialize.decorator';
import { Renting } from '@renting/schemas/renting.schema';

@Controller('renting')
@SerializeWith(Renting)
export class RentingController {
  constructor(private readonly rentingService: RentingService) { }

  @Post()
  create(@Body() createRentingDto: CreateRentingDto) {
    return this.rentingService.create(createRentingDto);
  }

  @Get()
  findAll() {
    return this.rentingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rentingService.findOne(+id);
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
