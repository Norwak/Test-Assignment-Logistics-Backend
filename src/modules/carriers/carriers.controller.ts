import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CarriersService } from './carriers.service';
import { CreateCarrierDto } from './dtos/create-carrier.dto';
import { UpdateCarrierDto } from './dtos/update-carrier.dto';

@Controller('carriers')
export class CarriersController {
  constructor(
    private carriersService: CarriersService
  ) {}

  @Get()
  async find(@Query('q') query: string) {
    return await this.carriersService.find(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.carriersService.findOne(id);
  }

  @Post()
  async create(@Body() createCarrierDto: CreateCarrierDto) {
    return await this.carriersService.create(createCarrierDto);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateCarrierDto: UpdateCarrierDto) {
    return await this.carriersService.update(id, updateCarrierDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.carriersService.remove(id);
  }
}
