import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dtos/create-client.dto';
import { UpdateClientDto } from './dtos/update-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(
    private clientsService: ClientsService
  ) {}

  @Get()
  async find(@Query('q') query: string) {
    return await this.clientsService.find(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.clientsService.findOne(id);
  }

  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    return await this.clientsService.create(createClientDto);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateClientDto: UpdateClientDto) {
    return await this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.clientsService.remove(id);
  }
}
