import { Body, Controller, Delete, Get, Param, Patch, Post, Query, SerializeOptions } from '@nestjs/common';
import { OffersService } from './offers.service';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { SearchOffersDto } from './dtos/search-offers.dto';
import { CreateOfferDto } from './dtos/create-offer.dto';
import { UpdateOfferDto } from './dtos/update-offer.dto';
import { OfferDto } from './dtos/offer.dto';

@Controller('offers')
@Serialize(OfferDto)
export class OffersController {
  constructor(
    private offersService: OffersService
  ) {}

  @Get('search')
  async search(@Query() query: SearchOffersDto) {
    return await this.offersService.search(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.offersService.findOne(id);
  }

  @Post()
  async create(@Body() createGameDto: CreateOfferDto) {
    return await this.offersService.create(createGameDto);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateGameDto: UpdateOfferDto) {
    return await this.offersService.update(id, updateGameDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.offersService.remove(id);
  }
}
